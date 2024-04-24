import {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    ColorResolvable
} from "discord.js";

import { env } from "./env";

import { PluginManager } from "./managers/plugin";
import { Plugins } from "./plugins/plugins";

import { CommandManager } from "./managers/command";
import { ComponentManager } from "./managers/component";
import { EventManager } from "./managers/event";
import { LoopManager } from "./managers/loop";

import RiotAPI from "unofficial-valorant-api";

//import { RiotAPI } from "./managers/riotApi";

import { Button } from "./types/component";
import { Command } from "./types/command";
import { Event } from "./types/event";
import { Loop } from "./types/loop";

export class KiwiClient extends Client {
    public embed: { 
        color: ColorResolvable | null;
    };

    public buttons: Collection<string, Button>;
    public commands: Collection<string, Command>;
    public events: Collection<string, Event>;
    public loops: Collection<string, Loop>;

    public PluginManager: PluginManager;
    public CommandManager: CommandManager;
    public ComponentManager: ComponentManager;
    public EventManager: EventManager;
    public LoopManager: LoopManager;
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
                GatewayIntentBits.AutoModerationExecution,
                GatewayIntentBits.AutoModerationConfiguration,
            ],
            partials: [
                Partials.GuildMember,
                Partials.Channel,
                Partials.Message,
                Partials.User,
            ]
        });

        this.setMaxListeners(25);

        this.embed = {
            color: "#2b2d31"
        }

        this.commands = new Collection();
        this.events = new Collection();
        this.buttons = new Collection();
        this.loops = new Collection();

        // Plugin Manager
        this.PluginManager = new PluginManager(this);

        // Command Manager
        this.CommandManager = new CommandManager(this);

        // Component Manager
        this.ComponentManager = new ComponentManager(this);

        // Event Manager
        this.EventManager = new EventManager(this);

        // Loop Manager
        this.LoopManager = new LoopManager(this);

        // RiotAPI
        this.RiotApi = new RiotAPI();

        // Load all plugins
        this.PluginManager.loadAll(Plugins)
        this.PluginManager.registerCommands([...this.commands.values()], env.TEST_GUILD);
    }

    public async getAvatarUrl(user: { id: string; avatar: string; }) {
        return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`;
    }
    
    public async getTag(user: { username: string; discriminator: string; }) {
        var username = user.username.charAt(0).toUpperCase() + user.username.slice(1);
        if (!["0", "0000"].includes(user.discriminator)) {
            return `${username}#${user.discriminator}`;
        } else {
            return username;
        }
    }
};