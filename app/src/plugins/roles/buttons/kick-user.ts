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
export const KickUser: Button = {
    config: {
        type: ComponentType.Button,
        custom_id: "kick-user",
        style: ButtonStyle.Danger,
        label: "Kick"
    },
    
    /**
    * @param {ButtonInteraction} interaction
    * @param {Client} client
    */
    async execute(interaction: ButtonInteraction, client: KiwiClient) {
        await interaction.deferReply({ ephemeral: true });
        var userId = interaction.customId.split("_")[1];
        var modId = interaction.customId.split("_")[2];

        if (interaction.user.id !== modId) {
            interaction.followUp({ content: "You are not the owner of this command!", ephemeral: true });
            return;
        }

        await interaction.guild.members.kick(userId, "User was kicked by a moderator").catch(() => {});
        interaction.message.edit({ content: "User was kicked!", components: [] });
    }
}