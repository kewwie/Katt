const {
    Client,
    GatewayIntentBits,
    Collection,
} = require("discord.js");

const EventHandler = require("./handlers/events");
const commandHandler = require("./handlers/commands");
const ButtonHandler = require("./handlers/buttons");

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

        // Command Loader
        this.commandHandler = new commandHandler(this);
        this.commandHandler.load();

        // Button Loader
        this.buttonHandler = new ButtonHandler(this);
        this.buttonHandler.load();
    }
};