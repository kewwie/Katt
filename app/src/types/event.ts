import { KiwiClient } from "../client";

export enum Events {
    GuildBanAdd = "guildBanAdd",
    GuildMemberAdd = "guildMemberAdd",
    GuildMemberUpdate = "guildMemberUpdate",
    GuildMemberRemove = "guildMemberRemove",
    InteractionCreate = "interactionCreate",
    Ready = "ready",
    GuildReady = "guildReady",
    VoiceStateUpdate = "voiceStateUpdate",
    GuildAdminAdd = "guildAdminAdd",
    GuildAdminRemove = "guildAdminRemove",
    GuildVerifiedAdd = "guildVerifiedAdd",
    GuildVerifiedRemove = "guildVerifiedRemove",
    MessageCreate = "messageCreate",
    GuildCreate = "guildCreate",
    ChannelUpdate = "channelUpdate",
    GuildUpdate = "guildUpdate",
}

export interface Event {
    name: string;
    plugin?: string;
    getGuildId?: (...args: any) => Promise<string>;
    execute: (client: KiwiClient, ...args: any) => void;
}