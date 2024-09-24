import { Collection, MessageComponentInteraction } from "discord.js";
import { KiwiClient } from "./client";
import { SelectMenu } from "./types/component";

export class ComponentManager {
    private client: KiwiClient;
    public SelectMenus: Collection<string, SelectMenu>;
    public Buttons: Collection<string, any>;

    constructor(client: KiwiClient) {
        this.client = client;
        this.SelectMenus = new Collection();
        this.Buttons = new Collection();
    }

    async onInteraction(interaction: MessageComponentInteraction) {

        if (interaction.isStringSelectMenu()) {
            let selectMenu = this.SelectMenus.get(interaction.customId);
            if (!selectMenu) return;

            var ownerId = interaction.customId = interaction.customId.split("+")[1];
            if (ownerId != interaction.user.id && ownerId != null) {
                interaction.reply({ content: "This isn't yours", ephemeral: true });
                return;
            };

            try {
                await selectMenu.execute(interaction, this.client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this select menu!', ephemeral: true });
            }
        } 
        else if (interaction.isButton()) {
            let button = this.Buttons.get(interaction.customId);
            if (!button) return;

            var ownerId = interaction.customId = interaction.customId.split("+")[1];
            if (ownerId != interaction.user.id && ownerId != null) {
                interaction.reply({ content: "This isn't yours", ephemeral: true });
                return;
            };

            try {
                await button.execute(interaction, this.client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
            }
        }
    }
};