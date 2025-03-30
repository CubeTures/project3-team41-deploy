import postgres from "postgres";
import "dotenv/config";

const sql = postgres({
	user: process.env.user,
	host: process.env.host,
	database: process.env.database,
	password: process.env.password,
});

export default sql;
