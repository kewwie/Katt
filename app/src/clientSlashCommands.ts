import { SlashCommand } from "./types/command";

import { ConfigSlash } from "./slash/config";
import { VoiceCommand } from "./slash/voice";

export const ClientSlashCommands: SlashCommand[] = [
    ConfigSlash,
    VoiceCommand
];