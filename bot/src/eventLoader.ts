import { readdir } from "fs";
import { join } from "path";

module.exports = class EventHandler {
    client: any;
    constructor(client: any) {
        this.client = client;
    }

    load() {
        readdir("/events/", (err: any, files: any) => {
        if (err) return console.error(err);

        for (let file of files) {
            const event = require(join(__dirname, "events") + file);
            const eventName = file.split('.')[0];
            this.client.on(eventName, event.execute().bind(null, this.client));
        }
        });
    }
};