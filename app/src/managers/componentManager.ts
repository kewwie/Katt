import { Collection, MessageComponentInteraction } from "discord.js";
import { KiwiClient } from "../client";
import { SelectMenu, Button } from "../types/component";
import { EventList } from "../types/event";

export class ComponentManager {
    private client: KiwiClient;
    public SelectMenus: Collection<string, SelectMenu>;
    public Buttons: Collection<string, Button>;

    constructor(client: KiwiClient) {
        this.client = client;
        this.SelectMenus = new Collection();
        this.Buttons = new Collection();

        this.client.on(EventList.InteractionCreate, this.onInteraction.bind(this));
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
            var customId = interaction.customId.split("+")[1];
            var optionOne = interaction.customId.split("?")[1];
            var optionTwo = interaction.customId.split("&")[1];
            var userId = interaction.customId.split("%")[1];
            var ownerId = interaction.customId.split("=")[1];

            let selectMenu = this.SelectMenus.get(customId);
            if (!selectMenu) return;

            if (ownerId != interaction.user.id && ownerId != null) {
                interaction.reply({ content: "This isn't yours", ephemeral: true });
                return;
            };

            if (interaction.guildId && selectMenu.module && !selectMenu.module?.default) {
                let isEnabled = await this.client.db.repos.guildModules
                    .findOneBy({ guildId: interaction.guildId, moduleId: selectMenu.module.id });
                if (!isEnabled) {
                    interaction.reply({ content: `This select menu is disabled!`, ephemeral: true });
                    return;
                }
            }

            try {
                await selectMenu.execute(interaction, { customId, optionOne, optionTwo, userId, ownerId }, this.client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There is an issue!', ephemeral: true });
            }
        } 
        else if (interaction.isButton()) {
            var customId = interaction.customId.split("+")[1];
            var optionOne = interaction.customId.split("?")[1];
            var optionTwo = interaction.customId.split("&")[1];
            var userId = interaction.customId.split("%")[1];
            var ownerId = interaction.customId.split("=")[1];

            let button = this.Buttons.get(customId);
            if (!button) return;

            if (ownerId != interaction.user.id && ownerId) {
                interaction.reply({ content: "This isn't yours", ephemeral: true });
                return;
            };

            if (interaction.guildId && button.module && !button.module?.default) {
                let isEnabled = await this.client.db.repos.guildModules
                    .findOneBy({ guildId: interaction.guildId, moduleId: button.module.id });
                if (!isEnabled) {
                    interaction.reply({ content: `This button is disabled!`, ephemeral: true });
                    return;
                }
            }

            try {
                await button.execute(interaction, { customId, optionOne, optionTwo, userId, ownerId }, this.client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There is an issue!', ephemeral: true });
            }
        }
    }
};