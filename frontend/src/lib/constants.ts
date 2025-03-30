import "dotenv/config";

export const API_URL =
	process.env.NODE_ENV === "development"
		? "http://localhost:3000"
		: "https://project3-team41-deploy.onrender.com";
