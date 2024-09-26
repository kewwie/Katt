import { Collection, MessageComponentInteraction } from "discord.js";
import { KiwiClient } from "./client";
import { SelectMenu, Button } from "./types/component";

export class ComponentManager {
    private client: KiwiClient;
    public SelectMenus: Collection<string, SelectMenu>;
    public Buttons: Collection<string, Button>;

    constructor(client: KiwiClient) {
        this.client = client;
        this.SelectMenus = new Collection();
        this.Buttons = new Collection();
    }

    public registerSelectMenu(selectMenu: SelectMenu) {
        var customId = selectMenu.customId;
        this.SelectMenus.set(customId, selectMenu);
    }

    public registerButton(button: Button) {
        var customId = button.customId;
        this.Buttons.set(customId, button);
    }

    async onInteraction(interaction: MessageComponentInteraction) {

        if (interaction.isAnySelectMenu()) {
            var [customId, optionOne, optionTwo, userId] = interaction.customId.split("+");
            let selectMenu = this.SelectMenus.get(customId);
            if (!selectMenu) return;

            if (userId != interaction.user.id && userId != null) {
                interaction.reply({ content: "This isn't yours", ephemeral: true });
                return;
            };

            try {
                await selectMenu.execute(interaction, { customId, optionOne, optionTwo, userId }, this.client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this select menu!', ephemeral: true });
            }
        } 
        else if (interaction.isButton()) {
            var [customId, optionOne, optionTwo, userId] = interaction.customId.split("+");
            let button = this.Buttons.get(customId);
            if (!button) return;

            if (userId != interaction.user.id && userId) {
                interaction.reply({ content: "This isn't yours", ephemeral: true });
                return;
            };

            try {
                await button.execute(interaction, { customId, optionOne, optionTwo, userId }, this.client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
            }
        }
    }
};