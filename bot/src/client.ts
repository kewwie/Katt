import {
    Client,
    GatewayIntentBits,
    Collection,
} from "discord.js";

const EventHandler = require("./eventHandler");
const ButtonHandler = require("./buttonHandler");

export class KiwiClient extends Client {
    public events: Collection<string, any>;
    public commands: Collection<string, any>;
    public buttons: Collection<string, any>;

    public eventHandler: any;
    public buttonHandler: any;

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
        this.eventHandler = new EventHandler(this);
        this.eventHandler.load();

        // Button Loader
        this.buttonHandler = new ButtonHandler(this);
        this.buttonHandler.load();
    }
};