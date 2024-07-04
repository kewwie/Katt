import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: resolve(__dirname, "..", ".env") });

export const env = {
    CLIENT_ID: process.env.CLIENT_ID as string | null,
    CLIENT_TOKEN: process.env.CLIENT_TOKEN as string | null,

    STAFF: (process.env.STAFF?.split(",") || []) as string[],
    STAFF_SERVERS: (process.env.STAFF_SERVERS?.split(",") || []) as string[],

    DB_HOST: "mysql",
    DB_PORT: process.env.DATABASE_PORT as string | null,
    DB_USER: "iwek",
    DB_PASSWORD: process.env.DATABASE_PASSWORD as string | null,
    DB_DATABASE: "iwek"
}
