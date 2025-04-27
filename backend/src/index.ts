import { serve } from "@hono/node-server";
import { Hono } from "hono";
import postgres from "postgres";
import { cors } from "hono/cors";
import dotenv from "dotenv";
import { googleAuth } from "@hono/oauth-providers/google";
import sql from "./sql.js";
import edit from "./edit.js";
import order from "./order.js";



const app = new Hono();
app.use("/*", cors());
app.route("/edit", edit);
app.route("/order", order);

dotenv.config();

//************************************************************************** BEGINNING OF GOOGLE API ********************************************* */

app.use(
	'/google',
	googleAuth({
		client_id: process.env.GOOGLE_CLIENT_ID,
		client_secret: process.env.GOOGLE_CLIENT_SECRET,
	  scope: ['openid', 'email', 'profile'],
	})
  )
  
  app.get('/google', async (c) => {
	const token = c.get('token')
	const grantedScopes = c.get('granted-scopes')
	const user = c.get('user-google')

	const redirectUrl = `http://pinkfluffy.netlify.app/kiosk/?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`;
  
	return c.redirect(redirectUrl);
  })


//************************************************************************** END OF GOOGLE API ********************************************* */
//************************************************************************** BEGINNING OF WEATHER API ********************************************* */

app.get("/weather", async (c) => {
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=77840`
  );
  const weatherData = await response.json();
  const dataNeeded = {
    location: weatherData.location.name,
    temp: weatherData.current.temp_f,
    condition: weatherData.current.condition.text,
  };

  return c.json(dataNeeded);
});

//************************************************************************** END OF WEATHER API ********************************************* */

app.get("/", (c) => {
  return c.json({ status: "operational" });
});

app.get("/employees", async (c) => {
  const employees = await sql`SELECT * FROM employees`;
  return c.json({ employees });
});

app.get("/items/:item", async (c) => {
  const item = c.req.param("item");
  const items = await sql`SELECT * FROM menu WHERE item = ${item}`;
  const data = c.json({ items });
  const price = JSON.stringify(data);
  return data;
});

app.get("/get_menu", async (c) => {
	const full_menu = await sql`SELECT * FROM menu`;
	return c.json(full_menu);
});

// Get profit over time
app.get("/report/SalesOverTime", async (c) => {
  const profitOverTime = await sql`
		WITH order_profits AS (
        SELECT 
            o.date,
            o.order_id,
            ROUND(CAST(o.price AS NUMERIC) - COALESCE((
                SELECT CAST(SUM(i.cost) AS NUMERIC)
                FROM unnest(o.drinks) AS drink
                JOIN menu m ON m.item = drink
                JOIN unnest(m.ingredients) AS ing ON TRUE
                JOIN ingredients i ON i.ingredient = ing
            ), 0), 2) AS profit
        FROM orders o
    ),
    daily_profits AS (
        SELECT 
            date,
            ROUND(SUM(profit), 2) AS daily_profit
        FROM order_profits
        GROUP BY date
    )
    SELECT 
        date,
        ROUND(SUM(daily_profit) OVER (ORDER BY date), 2) AS cumulative_profit
    FROM daily_profits
    ORDER BY date`;
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
  const items =
    await sql`SELECT * FROM employees WHERE name = ${username} AND password = ${password}`;
  if (items.length === 0) {
    return c.json({ perm: -1 });
  }
  return c.json({ perm: items[0].manager_id });
});

serve(
  {
    fetch: app.fetch,
    port: 3000, // port: Number(process.env.PORT) || 3000, // port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

export { app, sql };
