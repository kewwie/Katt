import { KiwiClient } from "../client";

export enum Events {
    guildBanAdd = "guildBanAdd",
    guildMemberAdd = "guildMemberAdd",
    interactionCreate = "interactionCreate",
    ready = "ready",
    voiceStateUpdate = "voiceStateUpdate",
}

export interface Event {
    name: string;
    once?: boolean;
    execute: (client: KiwiClient, ...args: any) => void;
}