const { readdirSync } = require("fs");
const { join } = require("path");

module.exports = class ButtonHandler {

    constructor(client) {
        this.client = client;
    }

    load() {
        for (let file of readdirSync(join(__dirname, "..", "buttons"))) {
            const button = require(join(__dirname, "..", "buttons/", file));
            this.client.buttons.set(button.data.id, button);
        }
    }
  };