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
                await loop.execute(this.client);
            }, loop.seconds * 1000);
        }
    }
};