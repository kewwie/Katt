import { readdir } from "fs";
import { join } from "path";

module.exports = class EventHandler {
    client: any;
    constructor(client: any) {
        this.client = client;
    }

    load() {
        readdir(join(__dirname, "events"), (err: any, files: any) => {
            if (err) return console.error(err);

            for (let file of files) {
                const event = require(join(__dirname, "events/", file));
                if (event.once) {
                    this.client.once(event.config.name, (...args: any) => event.config.execute(this.client, ...args));
                } else {
                    this.client.on(event.config.name, (...args: any) => event.config.execute(this.client, ...args));
                }
            }
        });
    }
};