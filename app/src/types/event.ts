import { KiwiClient } from "../client";

export enum Events {
    GuildBanAdd = "guildBanAdd",
    GuildMemberAdd = "guildMemberAdd",
    GuildMemberUpdate = "guildMemberUpdate",
    InteractionCreate = "interactionCreate",
    Ready = "ready",
    VoiceStateUpdate = "voiceStateUpdate",
}

export interface Event {
    name: string;
    once?: boolean;
    plugin?: string;
    manualCheck?: boolean;
    execute: (client: KiwiClient, ...args: any) => void;
}