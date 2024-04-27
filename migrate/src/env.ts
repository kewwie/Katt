import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: resolve(__dirname, "..", ".env") });

export const env = {
    DB_HOST: "mysql",
    DB_PORT: process.env.DATABASE_PORT,
    DB_USER: "kewiapp",
    DB_PASSWORD: process.env.DATABASE_PASSWORD,
    DB_DATABASE: "kewiapp",
}
