import {
    Client,
    GatewayIntentBits,
    Collection,
} from "discord.js";

const EventHandler = require("./eventLoader");
const ButtonHandler = require("./buttonHandler");

export class KiwiClient extends Client {
    public events: Collection<string, any>;
    public commands: Collection<string, any>;
    public buttons: Collection<string, any>;

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
        this.buttons = new Collection();
        
        // Event Loader
        let eventHandler = new EventHandler(this);
        eventHandler.load();

        // Button Loader
        let buttonHandler = new ButtonHandler(this);
        buttonHandler.load();
    }
};