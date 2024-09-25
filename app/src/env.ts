import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: resolve(__dirname, "..", ".env") });

export const env = {
    CLIENT_ID: process.env.CLIENT_ID as string,
    CLIENT_TOKEN: process.env.CLIENT_TOKEN as string,

    PREFIX: "!",
    STAFF_USERS: (process.env.STAFF_USERS?.split(",") || []) as string[],
    STAFF_SERVERS: (process.env.STAFF_SERVERS?.split(",") || []) as string[],

    //DATABASE_URL: process.env.DATABASE_URL as string,
    //DATABASE_NAME: process.env.DATABASE_NAME as string,
    DB_HOST: process.env.DATABASE_HOST as string,
    DB_PORT: process.env.DATABASE_PORT as string,
    DB_USER: process.env.DATABASE_USER as string,
    DB_PASSWORD: process.env.DATABASE_PASSWORD as string,
    DB_NAME: process.env.DATABASE_NAME as string,
}
