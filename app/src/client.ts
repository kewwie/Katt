import {
    Client,
    GatewayIntentBits,
    Collection,
    ColorResolvable
} from "discord.js";

import { EventHandler } from "./handlers/events";
import { CommandHandler } from "./handlers/commands";
import { ComponentHandler } from "./handlers/component";
import { RiotAPI } from "./handlers/riotApi";
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
    public eventHandler: EventHandler;
    public commandHandler: CommandHandler;
    public componentHandler: ComponentHandler;
    public riotApi: RiotAPI;

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
        
        // Event Loader
        this.eventHandler = new EventHandler(this);
        this.eventHandler.load();

        // Command Loader
        //this.commandHandler = new CommandHandler(this);
        //this.commandHandler.load();

        // Button Loader
        this.componentHandler = new ComponentHandler(this);
        this.componentHandler.load();

        // RiotAPI
        this.riotApi = new RiotAPI();
    }
};