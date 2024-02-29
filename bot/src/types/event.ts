import { KiwiClient } from "../client";

export interface Event {
    name: string;
    once?: boolean;
    execute(client: KiwiClient, payload: any): Promise<void>;
}