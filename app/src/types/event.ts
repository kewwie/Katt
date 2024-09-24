import { KiwiClient } from "../client";

export enum EventList {
    GuildBanAdd = "guildBanAdd",
    GuildMemberAdd = "guildMemberAdd",
    GuildMemberUpdate = "guildMemberUpdate",
    GuildMemberRemove = "guildMemberRemove",
    InteractionCreate = "interactionCreate",
    Ready = "ready",
    GuildReady = "guildReady",
    VoiceStateUpdate = "voiceStateUpdate",
    MessageCreate = "messageCreate",
    GuildCreate = "guildCreate",
    ChannelUpdate = "channelUpdate",
    GuildUpdate = "guildUpdate",
}

export interface Event {
    name: string;
    execute: (client: KiwiClient, ...args: any) => void;
}