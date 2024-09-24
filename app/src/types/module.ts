import { PrefixCommand } from './command';
import { SlashCommand } from './command';
import { UserCommand } from './command';

export interface Module {
    id: string;
    name: string;
    description: string;
    prefixCommands?: PrefixCommand[];
    slashCommands?: SlashCommand[];
    userCommands?: UserCommand[];
    global?: boolean;
    hidden?: boolean;
}