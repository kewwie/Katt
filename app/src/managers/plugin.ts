import { KiwiClient } from "../client";
import { Command } from "../types/command";
import { Events } from "../types/event";
import { Plugin } from "../types/plugin";

export class PluginManager {
    public client: KiwiClient
    public plugins: Plugin[];

    constructor(client: KiwiClient) {
        this.client = client;
        this.plugins = [];
    }

    load(plugin: Plugin) {
        plugin.beforeLoad?.(this.client);
        this.plugins.push(plugin);

        if (plugin.commands) {
            this.client.CommandManager.load(plugin.commands);
        }

        if (plugin.buttons) {
            this.client.ComponentManager.loadButtons(plugin.buttons);
        }

        if (plugin.events) {
            this.client.EventManager.load(plugin.events);
        }

        this.client.on(Events.InteractionCreate, (interaction: any) => this.client.ComponentManager.onInteraction(interaction));      
        plugin.afterLoad?.(this.client);
    }
    
    loadAll(plugins: Plugin[]) {
        for (let plugin of plugins) {
            this.load(plugin);
        }
    }

    async registerCommands(commands: Command[], guildId?: string | null) {
        if (guildId) {
            await this.client.CommandManager.unregisterAll();
        } else {
            await this.client.CommandManager.unregisterAllGuild();
        }
        this.client.CommandManager.register(commands, guildId);
        this.client.on(Events.InteractionCreate, (interaction: any) => this.client.CommandManager.onInteraction(interaction));
    }
}