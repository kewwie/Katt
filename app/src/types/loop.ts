import { KiwiClient } from "../client";

export interface Loop {
    name: string;
    seconds: number;
    execute: (client: KiwiClient) => Promise<void>;
}