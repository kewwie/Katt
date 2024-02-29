import {
    Client,
    GatewayIntentBits,
    Collection,
  } from "discord.js";

const EventHandler = require("./eventLoader");
//const ButtonHandler = require("./buttonHandler");

export class KiwiClient extends Client {
    commands: Collection<any, any>;
    eventHandler: any;
    buttonHandler: any;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        this.commands = new Collection();
        
        // Event Loader
        this.eventHandler = new EventHandler(this);
        this.eventHandler.load();

        // Button Loader
        //this.buttonHandler = new ButtonHandler(this);
        //this.buttonHandler.load();
    }
};