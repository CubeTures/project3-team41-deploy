import { serve } from "@hono/node-server";
import { Hono } from "hono";
import postgres from "postgres";
import { cors } from "hono/cors";
import dotenv from "dotenv";
import { googleAuth } from "@hono/oauth-providers/google";
import sql from "./sql.js";
import edit from "./edit.js";


const app = new Hono();
app.use("/*", cors());
app.route("/edit", edit);

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

	const redirectUrl = `http://localhost:5175/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`;
  
	return c.redirect(redirectUrl);
  })


//************************************************************************** END OF GOOGLE API ********************************************* */

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
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

export { app, sql };
