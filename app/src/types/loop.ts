import { KiwiClient } from "../client";

export interface Loop {
    name: string;
    seconds: number;
    plugin?: string;
    execute: (client: KiwiClient) => Promise<void>;
}