const { resolve } = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: resolve(__dirname, "..", ".env") });

module.exports.env = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CLIENT_TOKEN: process.env.CLIENT_TOKEN,
    TEST_GUILD: process.env.TEST_GUILD || null,

    MONGO_URI: process.env.MONGO_URI,
}
