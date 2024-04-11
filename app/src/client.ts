import {
    Client,
    GatewayIntentBits,
    Collection,
    ColorResolvable
} from "discord.js";

import { PluginManager } from "./managers/plugin";
import { Plugins } from "./plugins/plugins";

import { CommandManager } from "./managers/command";
import { EventManager } from "./managers/event";

import { RiotAPI } from "./managers/riotApi";

import { Command } from "./types/command";
import { Event } from "./types/event";

export class KiwiClient extends Client {
    public embed: { 
        color: ColorResolvable | null;
    };
    public getAvatarUrl: (user: {
        id: string; 
        avatar: string;
    }) => string;
    public commands: Collection<string, Command>;
    public events: Collection<string, Event>;
    public buttons: Collection<string, unknown>;

    public PluginManager: PluginManager;
    public CommandManager: CommandManager;
    public EventManager: EventManager;
    public RiotApi: RiotAPI;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildVoiceStates,
            ]
        });

        this.embed = {
            color: "#2b2d31"
        }

        this.getAvatarUrl = function (user: { id: string; avatar: string; }) {
            return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`;
        }

        this.commands = new Collection();
        this.events = new Collection();
        this.buttons = new Collection();

        // Plugin Manager
        this.PluginManager = new PluginManager(this);

        // Command Manager
        this.CommandManager = new CommandManager(this);

        // Event Manager
        this.EventManager = new EventManager(this);

        // RiotAPI
        this.RiotApi = new RiotAPI();

        // Load all plugins
        this.PluginManager.loadAll(Plugins)
        this.PluginManager.registerCommands([...this.commands.values()]);
    }
};