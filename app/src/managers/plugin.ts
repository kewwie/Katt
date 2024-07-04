import { KiwiClient } from "../client";
import { Events } from "../types/event";
import { Plugin } from "../types/plugin";

export class PluginManager {
    public client: KiwiClient
    public plugins: Plugin[];
    public AppCommandEventSet: boolean;
    public ButtonEventSet: boolean;

    constructor(client: KiwiClient) {
        this.client = client;
        this.plugins = [];
        this.AppCommandEventSet = false;
        this.ButtonEventSet = false;
    }

    load(plugin: Plugin) {
        plugin.beforeLoad?.(this.client);
        this.plugins.push(plugin);

        if (plugin.SlashCommands) {
            var SlashCommands = new Array();
            for (let command of plugin.SlashCommands) {
                command.plugin = plugin;
                SlashCommands.push(command);
            }
            this.client.CommandManager.loadSlash(SlashCommands);
        }

        if (plugin.UserCommands) {
            var UserCommands = new Array();
            for (let command of plugin.UserCommands) {
                command.plugin = plugin;
                UserCommands.push(command);
            }
            this.client.CommandManager.loadUser(UserCommands);
        }

        if (plugin.buttons) {
            var buttons = new Array();
            for (let button of plugin.buttons) {
                button.plugin = plugin;
                buttons.push(button);
            }
            this.client.ComponentManager.loadButtons(buttons);
        }

        if (plugin.events) {
            var events = new Array();
            for (let event of plugin.events) {
                event.plugin = plugin;
                events.push(event);
            }
            this.client.EventManager.load(events);
        }

        if (plugin.loops) {
            var loops = new Array();
            for (let loop of plugin.loops) {
                loop.plugin = plugin;
                loops.push(loop);
            }
            this.client.LoopManager.load(loops);
        }

        if (!this.AppCommandEventSet && (plugin.SlashCommands || plugin.buttons)) {
            this.client.on(Events.InteractionCreate, (interaction: any) => this.client.CommandManager.onInteraction(interaction));
            this.AppCommandEventSet = true;
        }

        if (!this.ButtonEventSet && plugin.buttons) {
            this.client.on(Events.InteractionCreate, (interaction: any) => this.client.ComponentManager.onInteraction(interaction));
            this.ButtonEventSet = true;
        }

        plugin.afterLoad?.(this.client);
    }
    
    loadAll(plugins: Plugin[]) {
        for (let plugin of plugins) {
            this.load(plugin);
        }
    }
}