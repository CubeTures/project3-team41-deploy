import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config({ path: "./secrets.env" });
const sql = postgres({
	user: process.env.user,
	host: process.env.host,
	database: process.env.database,
	password: process.env.password,
});

export default sql;
