import { Hono } from "hono";
import sql from "./sql.js";

const order = new Hono();

async function addXReport(customer_name: string, drinks: string[], price: number) {
	await sql`CREATE TABLE IF NOT EXISTS xreport (
		report_id SERIAL PRIMARY KEY,
		customer_name TEXT,
		drinks VARCHAR(40)[],
		price DOUBLE PRECISION
	)`;

	await sql`INSERT INTO xreport (customer_name, drinks, price) 
	VALUES (${customer_name}, ${drinks}, ${price})`;
}

order.post("/", async (c) => {
	console.log("Received POST request to /order");

	let body;
	try {
		body = await c.req.json();
		console.log("Parsed request body:", body);
	} catch (jsonErr) {
		console.error("Failed to parse JSON:", jsonErr);
		return c.json({ success: false, message: "Invalid JSON" }, 400);
	}

	const { customer_name, drinks, price, credit_card } = body;

	try {
		if (!credit_card || credit_card.length === 0) {
			console.log("Missing credit card info for", customer_name);
			return c.json({ success: false, message: "Payment failed: Invalid card." }, 400);
		}

		const customer = await sql`
			SELECT * FROM customers
			WHERE customer_name = ${customer_name} AND credit_card = ${credit_card}
		`;

		if (customer.length === 0) {
			await sql`
				INSERT INTO customers (credit_card, reward_tier, customer_name)
				VALUES (${credit_card}, ${1}, ${customer_name})
			`;
		}

		await sql`
			INSERT INTO orders (customer_name, drinks, price, date, time)
			VALUES (${customer_name}, ${drinks}, ${price}, CURRENT_DATE, CURRENT_TIME)
		`;

		await addXReport(customer_name, drinks, price);

		for (const drink of drinks) {
			const menuItem = await sql`
				SELECT ingredients FROM menu WHERE item = ${drink}
			`;

			if (menuItem.length > 0) {
				const ingredients = menuItem[0].ingredients;

				for (const ingredient of ingredients) {
					await sql`
						UPDATE ingredients
						SET quantity = quantity - 1
						WHERE ingredient = ${ingredient}
					`;
				}
			}
		}

		console.log("Order and payment processed for", customer_name);
		return c.json({ success: true, message: "Order and payment submitted!" });

	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Order submission error:", error.message, error.stack);
		} else {
			console.error("Unknown error during order submission:", error);
		}
		return c.json({ success: false, message: "Server error during payment." }, 500);
	}
});

order.get("/", async (c) => {
	const orders = await sql`SELECT * FROM orders ORDER BY date DESC, time DESC`;
	return c.json(orders);
});

order.get("/xreport", async (c) => {
	try {
		const report = await sql`SELECT * FROM xreport`;
		return c.json(report);
	} catch {
		return c.json([]);
	}
});

order.get("/zreport", async (c) => {
	try {
		const report = await sql`SELECT * FROM xreport`;
		await sql`DROP TABLE IF EXISTS xreport`;
		console.log("Z report of ", report);
		return c.json(report);
	} catch {
		return c.json([]);
	}
});

export default order;
