const { KiwiClient } = require("./client");
const { env } = require("./env");
const Database = require("./data/database");

const client = new KiwiClient();
client.login(env.CLIENT_TOKEN);

(async () => {
    await Database.query("CREATE TABLE IF NOT EXISTS nicknames (userId VARCHAR(100) PRIMARY KEY, guildId VARCHAR(100), nickname VARCHAR(100))");
    await Database.quary("CREATE TABLE IF NOT EXISTS verified (userId VARCHAR(100) PRIMARY KEY, guildId VARCHAR(100), type VARCHAR(25), by VARCHAR(100), autoverify TINYINT(1))");
})();
