import { Collection } from "discord.js";
import { KiwiClient } from "./client";
import { Module } from "./types/module";

export class ModuleManager {
    private client: KiwiClient;
    public Modules: Collection<string, Module>;

    constructor(client: KiwiClient) {
        this.client = client;
        this.Modules = new Collection();
    }

    load(module: Module) {
        this.Modules.set(module.id, module);
        if (module.events) {
            for (let event of module.events) {
                event.module = module;
                this.client.EventManager.load(event);
            }
        }
        if (module.prefixCommands) {
            for (let prefixCommand of module.prefixCommands) {
                prefixCommand.module = module;
                this.client.CommandManager.loadPrefix(prefixCommand);
            }
        }
        if (module.slashCommands) {
            for (let slashCommand of module.slashCommands) {
                slashCommand.module = module;
                this.client.CommandManager.loadSlash(slashCommand);
                if (module.staffServer) this.client.CommandManager.staffServerCommands.push(slashCommand.config);
            }
        }
        if (module.userCommands) {
            for (let userCommand of module.userCommands) {
                userCommand.module = module;
                this.client.CommandManager.loadUser(userCommand);
            }
        }
        if (module.selectMenus) {
            for (let selectMenu of module.selectMenus) {
                selectMenu.module = module;
                this.client.ComponentManager.registerSelectMenu(selectMenu);
            }
        }
        if (module.buttons) {
            for (let button of module.buttons) {
                button.module = module;
                this.client.ComponentManager.registerButton(button);
            }
        }
        if (module.schedules) {
            for (let schedule of module.schedules) {
                schedule.module = module;
                this.client.ScheduleManager.register(schedule);
            }
        }
    }

    async registerCommands(commands: any[], guildId?: string) {
        var cmds = [];
        for (let command of commands) {
            cmds.push(command.config);
        }
        this.client.CommandManager.register(cmds, guildId);
    }
};