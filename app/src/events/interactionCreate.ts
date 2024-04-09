import { KiwiClient } from "../client";
import { Command } from "../types/command";
import { Event, Events } from "../types/event";

export const event: Event = {
    name: Events.interactionCreate,

    /**
    * 
    * @param {KiwiClient} client
    * @param {any} interaction
    */
    async execute(client: KiwiClient, interaction: any) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                command.execute(interaction, client);
            } catch (err) {
                if (err) console.error(err);
                interaction.reply({
                    content: "An error occurred while executing that command.",
                    ephemeral: true,
                });
            }
            } else if (interaction.isAutocomplete()) {
                const command = client.commands.get(interaction.commandName);
        
                if (!command) {
                    console.error(`No command matching ${interaction.commandName} was found.`);
                    return;
                }
        
                /*try {
                    await command.autocomplete(interaction);
                } catch (error) {
                    console.error(error);
                }*/
            } else if (interaction.isButton()) {
    
            const buttonId = (interaction.customId).split("_")[0];
            const button = client.buttons.get(buttonId);
        
            try {
                button.execute(interaction, client);
            } catch (err) {
                if (err) console.error(err);
                interaction.reply({
                    content: "An error occurred while trying to execute this button.",
                    ephemeral: true,
                });
            }
            } else if (interaction.isSelectMenu()) {
                const button = client.buttons.get(interaction.customId);
                if (button) return button.execute(interaction, client);
            }
    }
}