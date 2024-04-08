const { KiwiClient } = require("./client");
const { env } = require("./env");
const { MongoClient } = require('mongodb');

const client = new KiwiClient();
client.database = new MongoClient(env.MONGO_URI);
client.database.connect();

client.login(env.CLIENT_TOKEN);
