import { Plugin } from "../types/plugin";

import { DefaultPlugin } from "./default"
import { AntiBanPlugin } from "./antiban"
import { CustomVoicePlugin } from "./customvoice";
import { GroupsPlugin } from "./groups"
import { ListPlugin } from "./list"
import { MessagePlugin } from "./message"
import { NicknamesPlugin } from "./nicknames"
import { RolesPlugin } from "./roles";
import { VerificationPlugin } from "./verification"
import { VoicePlugin } from "./voice"

/**
 * @type {Array<Plugin>}
 */
export const Plugins: Array<Plugin> = [
    DefaultPlugin,
    AntiBanPlugin,
    CustomVoicePlugin,
    GroupsPlugin,
    ListPlugin,
    MessagePlugin,
    NicknamesPlugin,
    RolesPlugin,
    VerificationPlugin,
    VoicePlugin
]