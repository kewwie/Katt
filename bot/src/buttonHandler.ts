import { readdirSync } from "fs";
import { join } from "path";

module.exports = class ButtonHandler {
    client: any;

    constructor(client: any) {
        this.client = client;
    }

    load() {
        for (let file of readdirSync(join(__dirname, "buttons"))) {
            const button = require(join(__dirname, "buttons/", file));
            this.client.buttons.set(button.default.data.name, button);
        }
    }
  };