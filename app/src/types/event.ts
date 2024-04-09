import { KiwiClient } from "../client";

export enum Events {
    groupJoin = "groupJoin",
    groupLeave = "groupLeave",
    guildBanAdd = "guildBanAdd",
    blacklistAdd = "blacklistAdd",
    guildMemberAdd = "guildMemberAdd",
    memberVerify = "memberVerify",
    interactionCreate = "interactionCreate",
    ready = "ready",
    voiceStateUpdate = "voiceStateUpdate",
}

export interface Event {
    name: string;
    once?: boolean;
    execute: (client: KiwiClient, ...args: any) => void;
}