const { resolve } = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: resolve(__dirname, "..", ".env") });

module.exports.env = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CLIENT_TOKEN: process.env.CLIENT_TOKEN,
    SMOKER_LOGS: process.env.SMOKER_LOGS,
    DB_HOST: "mysql",
    DB_PORT: process.env.DATABASE_PORT,
    DB_NAME: "kewwie",
    DB_USER: "root",
    DB_PASSWORD: process.env.DATABASE_ROOT_PASSWORD,
}