import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./tests/setup.js",
        files: "./tests/**/*.test.jsx"
    },
    base: import.meta.env.VITE_BASE_PATH || "/react100_vstda_boatslucas"
});
