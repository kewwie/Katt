import { KiwiClient } from "../client";
import { Module } from "./module";

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
    module?: Module;
    name: string;
    getGuildId?: (...args: any) => Promise<string>;
    execute: (client: KiwiClient, ...args: any) => void;
}