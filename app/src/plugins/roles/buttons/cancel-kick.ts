import { KiwiClient } from "../../../client";

import { 
    ButtonStyle,
    ComponentType,
    ButtonInteraction
} from "discord.js";

import { Button } from "../../../types/component";

/**
 * @type {Button}
 */
export const CancelKick: Button = {
    config: {
        type: ComponentType.Button,
        custom_id: "cancel-kick",
        style: ButtonStyle.Secondary,
        label: "Cancel"
    },
    
    /**
    * @param {ButtonInteraction} interaction
    * @param {Client} client
    */
    async execute(interaction: ButtonInteraction, client: KiwiClient) {
        var modId = interaction.customId.split("_")[2];

        if (interaction.user.id !== modId) {
            interaction.followUp({ content: "You are not the owner of this command!", ephemeral: true });
            return;
        }
        interaction.message.edit({ content: "Kick was cancelled!", components: [] });
    }
}