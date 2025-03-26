import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import postgres from "postgres";
import "dotenv/config"

console.log(process.env.user);
const sql = postgres({
	user: process.env.user,
	host: process.env.host,
	database: process.env.database,
	password: process.env.password,
});


const app = new Hono();
app.use("/*", cors());

app.get("/", (c) => {
	return c.json({ status: "operational" });
});

app.get("/menu", async (c) => {
	const menu = await sql`SELECT * FROM menu`;
	return c.json(menu);
});

app.put("/menu", async (c) => {
	const body = await c.req.json();
	console.log(body);
	return c.body("Completed Operation", 200);
});

app.delete("/menu", async (c) => {
	// const
	return c.body("Completed Operation", 200);
});

app.get("/inventory", async (c) => {
	const inventory = await sql`SELECT * from ingredients`;
	return c.json(inventory);
});

app.get("/employees", async (c) => {
	const employees = await sql`SELECT * FROM employees`;
	return c.json(employees);
});

app.get("/items/:item", async (c) => {
	const item = c.req.param("item");
	const items = await sql`SELECT * FROM menu WHERE item = ${item}`;
	const data = c.json({ items });
	const price = JSON.stringify(data);
	return data;
});

// Get profit over time
app.get("/report/SalesOverTime", async (c) => {
	const profitOverTime = await sql`
		SELECT 
			date,
			SUM(price) - (
		  		SELECT coalesce(SUM(i.cost), 0)
		  		FROM unnest(o.drinks) as drink
		  		JOIN menu m ON m.item = drink
		  		JOIN unnest(m.ingredients) as ing ON TRUE
		  		JOIN ingredients i ON i.ingredient = ing
			) as profit
	  	FROM 
			orders o
	  	GROUP BY 
			date
	  	ORDER BY 
			date ASC`;
	return c.json(profitOverTime);
});

// Get top 10 selling items
app.get("/report/TopItems", async (c) => {
	const topItems = await sql`
		SELECT
            unnest(drinks) AS item,
            COUNT(*) AS times_ordered
    	FROM
            orders
        GROUP BY
            item
        ORDER BY
            times_ordered DESC
        LIMIT 10`;
	return c.json(topItems);
});


//Verify if username and password work
app.get("/logins/:username/:password", async (c) => {
	const username = c.req.param("username");
	const password = c.req.param("password");
	const items = await sql`SELECT * FROM logins WHERE username = ${username} AND password = ${password}`;
	if(items.length === 0){
		return c.json({perm: -1});
	}
	return c.json({perm: items[0].perm});
});

serve(
	{
		fetch: app.fetch,
		port: 3000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	}
);

export default app;
