import { KiwiClient } from "../client";
import { readdir } from "fs";
import { join } from "path";

export class EventHandler {
    private client: KiwiClient;

    constructor(client: KiwiClient) {
        this.client = client;
    }

    load() {
        readdir(join(__dirname, "..", "events"), (err, files) => {
            if (err) return console.error(err);

            for (let file of files) {
                const event = require(join(__dirname, "..", "events/", file));
                console.log(event)
                if (event.once) {
                    this.client.once(event.name, (...args: any[]) => event.execute(this.client, ...args));
                } else {
                    this.client.on(event.name, (...args: any[]) => event.execute(this.client, ...args));
                }
            }
        });
    }
};