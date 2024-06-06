import { Plugin } from "../types/plugin";

import { AdminPlugin } from "./admin"
import { AntiBanPlugin } from "./antiban"
import { CustomVoicePlugin } from "./customvoice";
import { GroupsPlugin } from "./groups"
import { ListPlugin } from "./list"
import { MessagePlugin } from "./message"
import { NicknamesPlugin } from "./nicknames"
import { VerificationPlugin } from "./verification"
import { VoicePlugin } from "./voice"

/**
 * @type {Array<Plugin>}
 */
export const Plugins: Array<Plugin> = [
    AdminPlugin,
    AntiBanPlugin,
    CustomVoicePlugin,
    GroupsPlugin,
    ListPlugin,
    MessagePlugin,
    NicknamesPlugin,
    VerificationPlugin,
    VoicePlugin
]