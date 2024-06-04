import { KiwiClient } from "../../../client";

import { 
    ButtonStyle,
    ComponentType,
    ButtonInteraction
} from "discord.js";

import { Button } from "../../../types/component";

import { dataSource } from "../../../datasource";
import { GroupInvite } from "../../../entities/GroupInvite";

/**
 * @type {Button}
 */
export const DenyInvite: Button = {
    config: {
        type: ComponentType.Button,
        custom_id: "deny-invite",
        style: ButtonStyle.Danger,
        label: "Deny"
    },
    dms: true,
    
    /**
    * @param {ButtonInteraction} interaction
    * @param {Client} client
    */
    async execute(interaction: ButtonInteraction, client: KiwiClient) {
        interaction.deferUpdate();
        var userId = interaction.customId.split("_")[1];

        const GroupInvitesRepository = await dataSource.getRepository(GroupInvite);

        await GroupInvitesRepository.delete({ user_id: userId, message_id: interaction.message.id });
        var message = await interaction.channel.messages.fetch(interaction.message.id);
        if (message) {
            await message.delete();
        }
    }
}