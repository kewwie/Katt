const { KiwiClient } = require("./client");
const { env } = require("./env");
const Database = require("./data/database");

const client = new KiwiClient();
client.login(env.CLIENT_TOKEN);

(async () => {
    await Database.query("CREATE TABLE IF NOT EXISTS nicknames (userId VARCHAR(100) PRIMARY KEY, guildId VARCHAR(100), nickname VARCHAR(100) NULL)");
    await Database.query("CREATE TABLE IF NOT EXISTS verified (userId VARCHAR(100) PRIMARY KEY, guildId VARCHAR(100), type VARCHAR(25) NULL, byUser VARCHAR(100) NULL, autoVerify BOOLEAN NULL)");
    await Database.query("CREATE TABLE IF NOT EXISTS servers (guildId VARCHAR(100) PRIMARY KEY, verifiedRole VARCHAR(100) NULL, logsChannel VARCHAR(100) NULL, pendingChannel VARCHAR(100) NULL, verificationAdmin VARCHAR(100) NULL)");
})();
