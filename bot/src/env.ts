import { resolve } from "path";
import dotenv from 'dotenv';
dotenv.config({ path: resolve(__dirname, "../..", ".env") });

export const env = {
    CLIENT_ID: process.env.CLIENT_ID!,
    CLIENT_SECRET: process.env.CLIENT_SECRET!,
    CLIENT_TOKEN: process.env.CLIENT_TOKEN!,
}