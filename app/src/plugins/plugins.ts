import { Plugin } from "../types/plugin";

import { AdminPlugin } from "./admin"
import { AntiBanPlugin } from "./antiban"
import { GamesPlugin } from "./games"
import { GroupsPlugin } from "./groups"
import { ListPlugin } from "./list"
import { MessagePlugin } from "./message"
import { NicknamesPlugin } from "./nicknames"
import { ReadyPlugin } from "./ready"
import { VerificationPlugin } from "./verification"
import { VoicePlugin } from "./voice"

/**
 * @type {Array<Plugin>}
 */
export const Plugins = [
    AdminPlugin,
    AntiBanPlugin,
    GamesPlugin,
    GroupsPlugin,
    ListPlugin,
    MessagePlugin,
    NicknamesPlugin,
    ReadyPlugin,
    VerificationPlugin,
    VoicePlugin
]