import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: resolve(__dirname, "..", ".env") });

export const env = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CLIENT_TOKEN: process.env.CLIENT_TOKEN,

    URL: process.env.URL,

    DB_HOST: "mysql",
    DB_PORT: process.env.DATABASE_PORT,
    DB_USER: "kewiapp",
    DB_PASSWORD: process.env.DATABASE_PASSWORD,
    DB_DATABASE: "kewiapp",

    KEY: process.env.KEY,
}
