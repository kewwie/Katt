const { Database } = require("./database");

class Nicknames {
    async create() {
        try {
            await Database.authenticate();
                console.log('Connection has been established successfully.');
            } catch (error) {
                console.error('Unable to connect to the database:', error);
        }
    }
}