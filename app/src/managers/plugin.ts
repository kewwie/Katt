import { KiwiClient } from "../client";
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

        if (plugin.events) {
            this.client.EventManager.load(plugin.events);
        }

        plugin.afterLoad?.(this.client);
    }
    
    loadAll(plugins: Plugin[]) {
        for (let plugin of plugins) {
            this.load(plugin);
        }
    }
}