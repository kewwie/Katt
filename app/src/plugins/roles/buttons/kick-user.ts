import { KiwiClient } from "../../../client";

import { 
    ButtonStyle,
    ComponentType,
    ButtonInteraction,
    EmbedBuilder,
    TextChannel
} from "discord.js";

import { Button } from "../../../types/component";
import { Events } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { GuildConfigEntity } from "../../../entities/GuildConfig";
import { GuildGroupEntity } from "../../../entities/GuildGroup";
import { GroupMemberEntity } from "../../../entities/GroupMember";
import { UserVerifiedEntity } from "../../../entities/UserVerified";
import { PendingMessageEntity } from "../../../entities/PendingMessage";

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
        interaction.message.edit("User has been kicked!");
    }
}