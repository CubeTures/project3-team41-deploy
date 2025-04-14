import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from 'path'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
		react(),
		tailwindcss(),
		{
			name: 'generate-redirects',
			writeBundle() {
			  const redirects = '/*    /index.html   200\n'
			  fs.writeFileSync(resolve('dist', '_redirects'), redirects)
			}
		  },
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
