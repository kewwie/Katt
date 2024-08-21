import {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    ColorResolvable,
    ClientPresenceStatus
} from "discord.js";

import { DatabaseManager } from "./databaseManager";

import { CommandManager } from "./commandManager";
import { ComponentManager } from "./componentManager";
import { EventManager } from "./eventManager";

import { Button } from "./types/component";
import { PrefixCommand, SlashCommand, UserCommand } from "./types/command";
import { Event, Events } from "./types/event";

import { ClientEvents } from "./clientEvents";
import { ClientPrefixCommands } from "./clientPrefixCommands";
import { ClientSlashCommands } from "./clientSlashCommands";


export class KiwiClient extends Client {
    public embed: { 
        color: ColorResolvable | null;
    };

    public PrefixCommands: Collection<string, PrefixCommand>;
    public SlashCommands: Collection<string, SlashCommand>;
    public UserCommands: Collection<string, UserCommand>;

    public Events: Collection<string, Event>
    public Buttons: Collection<string, Button>;

    public DatabaseManager: DatabaseManager;

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

        this.PrefixCommands = new Collection();
        this.SlashCommands = new Collection();
        this.UserCommands = new Collection();
        
        this.Events = new Collection();
        this.Buttons = new Collection();

        // Database Manager
        this.DatabaseManager = new DatabaseManager(this);

        // Event Manager
        this.EventManager = new EventManager(this);
        for (let event of ClientEvents) {
            this.EventManager.load(event);
        }
        this.EventManager.register([...this.Events.values()]);

        // Command Manager
        this.CommandManager = new CommandManager(this);
        for (let command of ClientPrefixCommands) {
            this.CommandManager.loadPrefix(command);
        }
        for (let command of ClientSlashCommands) {
            this.CommandManager.loadSlash(command);
        }
        this.on(Events.InteractionCreate, this.CommandManager.onInteraction.bind(this.CommandManager));
        this.on(Events.MessageCreate, this.CommandManager.onMessage.bind(this.CommandManager));

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