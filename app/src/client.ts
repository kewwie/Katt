import {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    ColorResolvable,
    ClientPresenceStatus
} from "discord.js";

import { DatabaseManager } from "./databaseManager";

import { PluginManager } from "./pluginManager";
import { Plugins } from "./plugins/plugins";

import { CommandManager } from "./commandManager";
import { ComponentManager } from "./componentManager";
import { EventManager } from "./eventManager";

import { Button } from "./types/component";
import { SlashCommand, UserCommand } from "./types/command";
import { Event, Events } from "./types/event";
import { Loop } from "./types/loop";

export class KiwiClient extends Client {
    public embed: { 
        color: ColorResolvable | null;
    };

    public buttons: Collection<string, Button>;
    public SlashCommands: Collection<string, SlashCommand>;
    public UserCommands: Collection<string, UserCommand>;
    public PrefixCommands: Collection<string, SlashCommand>;
    public events: Collection<string, Event>

    public DatabaseManager: DatabaseManager;
    public PluginManager: PluginManager;
    public CommandManager: CommandManager;
    public ComponentManager: ComponentManager;
    public EventManager: EventManager;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildVoiceStates,
                //GatewayIntentBits.AutoModerationExecution,
                //GatewayIntentBits.AutoModerationConfiguration,
            ],
            partials: [
                Partials.GuildMember,
                Partials.Channel,
                Partials.Message,
                Partials.User,
            ],
            presence: {
                status: "online" as ClientPresenceStatus,
            }
        });

        this.embed = {
            color: "#2b2d31"
        }

        this.SlashCommands = new Collection();
        this.UserCommands = new Collection();
        this.PrefixCommands = new Collection();
        this.events = new Collection();
        this.buttons = new Collection();

        // Database Manager
        this.DatabaseManager = new DatabaseManager(this);

        // Plugin Manager
        this.PluginManager = new PluginManager(this);

        // Command Manager
        this.CommandManager = new CommandManager(this);

        // Component Manager
        this.ComponentManager = new ComponentManager(this);

        // Event Manager
        this.EventManager = new EventManager(this);

        // Load all plugins
        //this.PluginManager.loadAll(Plugins);

        this.on(Events.Ready, async () => {
            console.log(`${this.user?.username} is Online`);
            for (let guild of await this.guilds.fetch()) {
                this.CommandManager.register([
                    ...this.SlashCommands.values(),
                    ...this.UserCommands.values()
                ], guild[0]);
                this.emit(Events.GuildReady, await guild[1].fetch());
            }
        });

        this.on(Events.GuildCreate, async (guild) => {
            console.log(`Joined ${guild.name}`);
            this.CommandManager.register([
                ...this.SlashCommands.values(),
                ...this.UserCommands.values()
            ], guild.id);
        });
    }

    public capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
};