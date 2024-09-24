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
                if (module.global) this.client.CommandManager.globalCommands.push(slashCommand.config);
            }
        }
        if (module.userCommands) {
            for (let userCommand of module.userCommands) {
                userCommand.module = module;
                this.client.CommandManager.loadUser(userCommand);
                //if (module.global) this.client.CommandManager.globalCommands.push(userCommand.config.toJSON());
            }
        }
    }

    async register(guildId?: string) {
        if (!guildId) {
            this.client.CommandManager.register(this.client.CommandManager.globalCommands);
            return;
        }

        var commands = [];
        for (let module of this.Modules.values()) {
            if (module.global) continue;
            var isEnabled = await this.client.DatabaseManager.isModuleEnabled(guildId, module.id);
            if (!isEnabled) continue;

            if (module.slashCommands) {
                commands.push(...module.slashCommands.map(command => command.config.toJSON()));
            }
            if (module.userCommands) {
                //commands.push(...module.userCommands.map(command => command.config.toJSON()));
            }
        }
        this.client.CommandManager.register(commands, guildId);
    }
};