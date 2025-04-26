const environment = process.env.NODE_ENV; //Must be named NODE_ENV


export const API_URL =
    environment === "development"
        ? "http://localhost:3000"
        : "https://project3-team41-deploy.onrender.com";