import { Hono } from "hono";
import sql from "./sql.js";

const app = new Hono();

const MenuItem = ["item", "price", "description", "ingredients", "image_url"];
const Ingredient = ["ingredient", "cost", "quantity", "allergens"];
const Employee = [
	"employee_id",
	"hours_worked",
	"manager_id",
	"name",
	"password",
	"wage",
];


//Getters and setters for all tables basically

app.get("/menu", async (c) => { // Shrimple HTML command
	const menu = await sql`SELECT * FROM menu`;
	return c.json(menu);
});

app.post("/menu", async (c) => {
	const obj = await c.req.json();
	await sql`INSERT INTO menu ${sql(obj, MenuItem)}`;
	return c.body("Operation Completed.", 200);
});

app.put("/menu", async (c) => {
	const { from, to } = await c.req.json();
	await sql`DELETE FROM menu WHERE item = ${from.item}`;
	await sql`INSERT INTO menu ${sql(to, MenuItem)}`;
	return c.body("Operation Completed.", 200);
});

app.delete("/menu", async (c) => {
	const obj = await c.req.json();
	await sql`DELETE FROM menu WHERE item = ${obj.item}`;
	return c.body("Operation Completed.", 200);
});

app.get("/inventory", async (c) => { //Also shrimple
	const inventory = await sql`SELECT * from ingredients`;
	return c.json(inventory);
});

app.post("/inventory", async (c) => {
	const obj = await c.req.json();
	await sql`INSERT INTO ingredients ${sql(obj, Ingredient)}`;
	return c.body("Operation Completed.", 200);
});

app.put("/inventory", async (c) => {
	const { from, to } = await c.req.json();
	await sql`DELETE FROM ingredients WHERE ingredient = ${from.ingredient}`;
	await sql`INSERT INTO ingredients ${sql(to, Ingredient)}`;
	return c.body("Operation Completed.", 200);
});

app.delete("/inventory", async (c) => {
	const obj = await c.req.json();
	await sql`DELETE FROM ingredients WHERE ingredient = ${obj.ingredient}`;
	return c.body("Operation Completed.", 200);
});

app.get("/employees", async (c) => {
	const employees = await sql`SELECT * FROM employees`;
	return c.json(employees);
});

app.post("/employees", async (c) => {
	const obj = await c.req.json();
	await sql`INSERT INTO employees ${sql(obj, Employee)}`;
	return c.body("Operation Completed.", 200);
});

app.put("/employees", async (c) => {
	const { from, to } = await c.req.json();
	await sql`DELETE FROM employees WHERE employee_id = ${from.employee_id}`;
	await sql`INSERT INTO employees ${sql(to, Employee)}`;
	return c.body("Operation Completed.", 200);
});

app.delete("/employees", async (c) => {
	const obj = await c.req.json();
	await sql`DELETE FROM employees WHERE employee_id = ${obj.employee_id}`;
	return c.body("Operation Completed.", 200);
});

export default app;
