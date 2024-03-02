const {
    Client,
    GatewayIntentBits,
    Collection,
} = require("discord.js");

const EventHandler = require("./eventHandler");
const ButtonHandler = require("./buttonHandler");

module.exports.KiwiClient = class KiwiClient extends Client {
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