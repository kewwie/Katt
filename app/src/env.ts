import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: resolve(__dirname, "..", ".env") });

export const env = {
    CLIENT_ID: process.env.CLIENT_ID as string,
    CLIENT_TOKEN: process.env.CLIENT_TOKEN as string,

    STAFF: (process.env.STAFF?.split(",") || []) as string[],
    STAFF_SERVERS: (process.env.STAFF_SERVERS?.split(",") || []) as string[],

    DATABASE_URL: process.env.DATABASE_URL as string,
    DATABASE_NAME: process.env.DATABASE_NAME as string,
}
