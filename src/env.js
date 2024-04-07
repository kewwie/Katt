const { resolve } = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: resolve(__dirname, "..", ".env") });

module.exports.env = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CLIENT_TOKEN: process.env.CLIENT_TOKEN,
    
    GUILD_ID: process.env.GUILD_ID,
    LOGS_CHANNEL: process.env.LOGS_CHANNEL,
    PENDING_CHANNEL: process.env.PENDING_CHANNEL,
    GUEST_ROLE: process.env.GUEST_ROLE,
    MEMBER_ROLE: process.env.MEMBER_ROLE,

    MONGO_URI: process.env.MONGO_URI,

    STATUS: process.env.STATUS || null,
}
