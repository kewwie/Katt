import {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    ColorResolvable
} from "discord.js";

import { PluginManager } from "./managers/plugin";
import { Plugins } from "./plugins/plugins";

import { CommandManager } from "./managers/command";
import { ComponentManager } from "./managers/component";
import { EventManager } from "./managers/event";
import { LoopManager } from "./managers/loop";

import { Button } from "./types/component";
import { SlashCommand } from "./types/command";
import { Event, Events } from "./types/event";
import { Loop } from "./types/loop";

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

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
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
            ],
            presence: {
                status: "idle"
            }
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

        // Load all plugins
        this.PluginManager.loadAll(Plugins);

        this.on(Events.Ready, async () => {
            console.log(`${this.user?.username} is Online`);
            for (let guild of await this.guilds.fetch()) {
                this.CommandManager.register([...this.SlashCommands.values()], guild[0]);
                this.emit(Events.GuildReady, await guild[1].fetch());
            }
        });

        this.on(Events.GuildCreate, async (guild) => {
            console.log(`Joined ${guild.name}`);
            this.CommandManager.register([...this.SlashCommands.values()], guild.id);
        });
    }
};