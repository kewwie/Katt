import { KiwiClient } from "../client";
import { Plugin } from "./plugin";

export enum Events {
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
    plugin?: Plugin;
    getGuildId?: (...args: any) => Promise<string>;
    execute: (client: KiwiClient, ...args: any) => void;
}