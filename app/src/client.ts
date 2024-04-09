import {
    Client,
    GatewayIntentBits,
    Collection
} from "discord.js";
import { env } from "./env";

import { MongoClient } from "mongodb";

import { EventHandler } from "./handlers/events";
import { CommandHandler } from "./handlers/commands";
import { ButtonHandler } from "./handlers/buttons";
import { RiotAPI } from "./handlers/riotApi";
import { Command } from "./types/command";
import { Event } from "./types/event";

export class KiwiClient extends Client {
    public database: MongoClient;
    public embed: { color: string; };
    public getAvatarUrl: (user: {
        id: string; avatar: string;
    }) => string;
    public commands: Collection<string, Command>;
    public events: Collection<string, Event>;
    public buttons: Collection<string, unknown>;
    public eventHandler: EventHandler;
    public commandHandler: CommandHandler;
    public buttonHandler: ButtonHandler;
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

        this.database = new MongoClient(env.MONGO_URI);
        this.database.connect();

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
        this.commandHandler = new CommandHandler(this);
        this.commandHandler.load();

        // Button Loader
        this.buttonHandler = new ButtonHandler(this);
        this.buttonHandler.load();

        // RiotAPI
        this.riotApi = new RiotAPI();
    }
};