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

import { Button } from "./types/component";
import { SlashCommand } from "./types/command";
import { Event, Events } from "./types/event";
import { Loop } from "./types/loop";

import { dataSource } from "./data/datasource";
import { GuildPlugins } from "./data/entities/GuildPlugins";

export class KiwiClient extends Client {
    public embed: { 
        color: ColorResolvable | null;
    };

    public buttons: Collection<string, Button>;
    public SlashCommands: Collection<string, SlashCommand>;
    public PrefixCommands: Collection<string, SlashCommand>;
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

        this.SlashCommands = new Collection();
        this.PrefixCommands = new Collection();
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
        this.PluginManager.loadAll(Plugins);

        this.on(Events.Ready, async () => {
            console.log(`${this.user?.username} is Online`);
            for (let guild of await this.guilds.fetch()) {
                this.CommandManager.register([...this.SlashCommands.values()], guild[0]);
                this.emit(Events.GuildReady, this, guild[1]);
            }
        });
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

    public async getGuildPlugin(guildId: string, pluginName: string) {
        const GuildPluginsRepository = await dataSource.getRepository(GuildPlugins);
        var enabled = await GuildPluginsRepository.findOne({ where: { guild_id: guildId, plugin: pluginName } });
        return enabled;
    }

    public async calculateXP(level: number) {
        return 5 * (level ** 2) + 50 * level + 100;
    }
};