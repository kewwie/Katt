const { KiwiClient } = require("./client");
const { env } = require("./env");
const Database = require("./data/database");

const client = new KiwiClient();
client.login(env.CLIENT_TOKEN);

(async () => {
    await Database.query("CREATE TABLE IF NOT EXISTS nicknames (userId VARCHAR(100) PRIMARY KEY, guildId VARCHAR(100), nickname VARCHAR(100))", { logging: false });
    await Database.query("CREATE TABLE IF NOT EXISTS verified (userId VARCHAR(100) PRIMARY KEY, guildId VARCHAR(100), dateTime VARCHAR(200), byUser VARCHAR(100))", { logging: false });
    await Database.query("CREATE TABLE IF NOT EXISTS servers (guildId VARCHAR(100) PRIMARY KEY, verifiedRole VARCHAR(100) NULL, logsChannel VARCHAR(100) NULL, pendingChannel VARCHAR(100) NULL, verificationAdmin VARCHAR(100) NULL)", { logging: false });
    await Database.query("CREATE TABLE IF NOT EXISTS userRoles (id INT PRIMARY KEY AUTO_INCREMENT, userId VARCHAR(100), guildId VARCHAR(100), roleId VARCHAR(100))", { logging: false })
})();
