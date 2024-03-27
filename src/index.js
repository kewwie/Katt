const { KiwiClient } = require("./client");
const { env } = require("./env");

const client = new KiwiClient();
client.login(env.CLIENT_TOKEN);
