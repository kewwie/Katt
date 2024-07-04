import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: resolve(__dirname, "..", ".env") });

export const env = {
    CLIENT_ID: process.env.CLIENT_ID as string,
    CLIENT_TOKEN: process.env.CLIENT_TOKEN as string,

    STAFF: (process.env.STAFF).split(",") as string[],
    STAFF_SERVERS: (process.env.STAFF_SERVERS).split(",") as string[],

    DB_HOST: "mysql",
    DB_PORT: process.env.DATABASE_PORT,
    DB_USER: "iwek",
    DB_PASSWORD: process.env.DATABASE_PASSWORD,
    DB_DATABASE: "iwek"
}
