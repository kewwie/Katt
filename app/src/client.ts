import {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    ColorResolvable,
    ClientPresenceStatus
} from "discord.js";

import { DatabaseManager } from "./databaseManager";

import { EventManager } from "./eventManager";
import { ComponentManager } from "./componentManager";
import { PageManager } from "./pageManager";
import { CommandManager } from "./commandManager";
import { ScheduleManager } from "./scheduleManager";
import { ModuleManager } from "./moduleManager";

import { Event, EventList } from "./types/event";

// Importing All Events
import { GuildCreate } from "./events/guildCreate";
import { GuildReady } from "./events/guildReady";
import { Ready } from "./events/ready";
import { VoiceStateUpdate } from "./modules/activity/events/voiceStateUpdate";

export class KiwiClient extends Client {
    public Settings: {
        color: ColorResolvable
    };
    public Events: Collection<string, Event>;

    public db: DatabaseManager;
    
    public EventManager: EventManager;
    public ComponentManager: ComponentManager;
    public PageManager: PageManager;
    public CommandManager: CommandManager;
    public ScheduleManager: ScheduleManager;
    public ModuleManager: ModuleManager;

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

        this.Settings = {
            color: "#7289DA"
        }

        // Database Manager
        this.db = new DatabaseManager(this);


        // Event Manager
        this.EventManager = new EventManager(this);
        this.Events = new Collection();
        var ClientEvents = [
            GuildCreate,
            GuildReady,
            Ready,
            VoiceStateUpdate
        ]
        
        for (let event of ClientEvents) {
            this.EventManager.load(event);
        }
        this.EventManager.register([...this.Events.values()]);

        // Component Manager
        this.ComponentManager = new ComponentManager(this);
        this.on(EventList.InteractionCreate, this.ComponentManager.onInteraction.bind(this.ComponentManager));
        // Page Manager
        this.PageManager = new PageManager(this);

        // Command Manager
        this.CommandManager = new CommandManager(this);
        this.on(EventList.InteractionCreate, this.CommandManager.onInteraction.bind(this.CommandManager));
        this.on(EventList.MessageCreate, this.CommandManager.onMessage.bind(this.CommandManager));

        // Schedule Manager
        this.ScheduleManager = new ScheduleManager(this);

        this.ModuleManager = new ModuleManager(this);
    }

    public capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    public createCustomId(
        options: { 
            start: string,
            optionOne?: string,
            optionTwo?: string,
            userId?: string
        }): string {
            var optionOne = options.optionOne || "";
            var optionTwo = options.optionTwo || "";
            var userId = options.userId || "";
        return `${options.start}+${optionOne}+${optionTwo}+${userId}`;
    }
};