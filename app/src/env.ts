import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: resolve(__dirname, "..", ".env") });

export const env = {
    CLIENT_ID: process.env.CLIENT_ID as string,
    CLIENT_SECRET: process.env.CLIENT_SECRET as string,
    CLIENT_TOKEN: process.env.CLIENT_TOKEN as string,
    TEST_GUILD: process.env.TEST_GUILD || null as string | null,

    DB_HOST: "mysql",
    DB_PORT: process.env.DATABASE_PORT,
    DB_USER: "kewiapp",
    DB_PASSWORD: process.env.DATABASE_PASSWORD,
    DB_DATABASE: "kewiapp",
}
