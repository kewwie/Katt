import { PrefixCommand } from './command';
import { SlashCommand } from './command';
import { UserCommand } from './command';
import { Button, SelectMenu } from './component';

export interface Module {
    id: string;
    name: string;
    description: string;
    prefixCommands?: PrefixCommand[];
    slashCommands?: SlashCommand[];
    userCommands?: UserCommand[];
    selectMenus?: SelectMenu[];
    buttons?: Button[];
    default?: boolean;
    global?: boolean;
    hidden?: boolean;
    staffOnly?: boolean;
    staffServer?: string;
}