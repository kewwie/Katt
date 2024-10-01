import {
    Client,
    GatewayIntentBits,
    Partials,
    Collection,
    ColorResolvable,
    ClientPresenceStatus
} from "discord.js";

import { DatabaseManager } from "./managers/databaseManager";

import { EventManager } from "./managers/eventManager";
import { ComponentManager } from "./managers/componentManager";
import { PageManager } from "./pageManager";
import { CommandManager } from "./managers/commandManager";
import { ScheduleManager } from "./managers/scheduleManager";
import { ModuleManager } from "./managers/moduleManager";

export class KiwiClient extends Client {
    public Settings: {
        color: ColorResolvable
    };
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

        // Component Manager
        this.ComponentManager = new ComponentManager(this);

        // Page Manager
        this.PageManager = new PageManager(this);

        // Command Manager
        this.CommandManager = new CommandManager(this);

        // Schedule Manager
        this.ScheduleManager = new ScheduleManager(this);

        this.ModuleManager = new ModuleManager(this);
    }

    public capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    public createCustomId(
        options: { 
            customId: string,
            optionOne?: string,
            optionTwo?: string,
            ownerId?: string
        }): string {
            var optionOne = options.optionOne || "";
            var optionTwo = options.optionTwo || "";
            var ownerId = options.ownerId || "";
        return `+${options.customId}+?${optionOne}?&${optionTwo}&=${ownerId}=`;
    }
};