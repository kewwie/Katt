const { KiwiClient } = require("./client");
const { env } = require("./env");
const Database = require("./data/database");

const client = new KiwiClient();
client.login(env.CLIENT_TOKEN);

(async () => {
    try {
        await Database.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
    }

    await Database.query("CREATE TABLE IF NOT EXISTS nicknames (userId VARCHAR(100) PRIMARY KEY, guildId VARCHAR(100), nickname VARCHAR(100))");

    try {
        await Database.close();
            console.log('Connection has been closed successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
    }
})();
