import { KiwiClient } from "../client";
import { Loop } from "../types/loop";

export class LoopManager {
    private client: KiwiClient;

    constructor(client: KiwiClient) {
        this.client = client;
    }

    load(loops: Loop[]) {
        for (let loop of loops) {
            this.client.loops.set(loop.name, loop);

            setInterval(async () => {
                for (let [_, guild] of await this.client.guilds.fetch()) {
                    await loop.execute(this.client, await guild.fetch());
                }
            }, loop.seconds * 1000);
        }
    }
};