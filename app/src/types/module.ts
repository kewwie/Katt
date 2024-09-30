import { PrefixCommand } from './command';
import { SlashCommand } from './command';
import { UserCommand } from './command';
import { Button, SelectMenu } from './component';
import { Schedule } from './schedule';

export interface Module {
    id: string;
    name?: string;
    prefixCommands?: PrefixCommand[];
    slashCommands?: SlashCommand[];
    userCommands?: UserCommand[];
    selectMenus?: SelectMenu[];
    buttons?: Button[];
    schedules?: Schedule[];
    default?: boolean;
    global?: boolean;
    hidden?: boolean;
    staffOnly?: boolean;
    staffServer?: string;
}