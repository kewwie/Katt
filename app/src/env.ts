const { resolve } = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: resolve(__dirname, "..", ".env") });

export const env = {
    CLIENT_ID: process.env.CLIENT_ID as string,
    CLIENT_SECRET: process.env.CLIENT_SECRET as string,
    CLIENT_TOKEN: process.env.CLIENT_TOKEN as string,
    TEST_GUILD: process.env.TEST_GUILD || null as string | null,

    MONGO_URI: process.env.MONGO_URI as string,
}
