import {
    Client,
    GatewayIntentBits,
    Collection,
} from "discord.js";

const EventHandler = require("./eventLoader");
//const ButtonHandler = require("./buttonHandler");

export class KiwiClient extends Client {
    public commands: Collection<string, any>;
    public events: Collection<string, Event>;

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
        this.events = new Collection();
        
        // Event Loader
        let eventHandler = new EventHandler(this);
        eventHandler.load();

        // Button Loader
        //this.buttonHandler = new ButtonHandler(this);
        //this.buttonHandler.load();
    }
};