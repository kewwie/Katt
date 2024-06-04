import { KiwiClient } from "../../../client";

import { 
    ButtonStyle,
    ComponentType,
    ButtonInteraction,
    EmbedBuilder,
    TextChannel
} from "discord.js";

import { Button } from "../../../types/component";

import { dataSource } from "../../../datasource";
import { GuildConfig } from "../../../entities/GuildConfig";
import { PendingMessage } from "../../../entities/PendingMessage";

/**
 * @type {Button}
 */
export const DenyUser: Button = {
    config: {
        type: ComponentType.Button,
        custom_id: "deny-user",
        style: ButtonStyle.Danger,
        label: "Deny"
    },
    
    /**
    * @param {ButtonInteraction} interaction
    * @param {Client} client
    */
    async execute(interaction: ButtonInteraction, client: KiwiClient) {
        await interaction.deferReply({ ephemeral: true });
        const GuildRepository = await dataSource.getRepository(GuildConfig);
        const PendingMessagesRepository = await dataSource.getRepository(PendingMessage);

        var userId = interaction.customId.split("_")[1];

        var message = await interaction.channel.messages.fetch(interaction.message.id);
        if (message) {
            await message.delete();
        }
        PendingMessagesRepository.delete({ user_id: userId, guild_id: interaction.guild.id });

        var member = await interaction.guild.members.fetch(userId);
        if (member) {
            var DeniedEmbed = new EmbedBuilder()
                .setTitle("You've Been Denied")
                .setThumbnail(interaction.guild.iconURL())
                .addFields(
                    { name: "Server ID", value: interaction.guild.id },
                    { name: "Server Name", value: interaction.guild.name },
                    { name: "Type", value: "Guest" }
                )
                .setFooter({ text: "Sorry!" })
                .setColor(0xFF474D);

            await member.send({ embeds: [DeniedEmbed] }).catch(() => {});
            await member.kick("Denied");
        }

        const guild = await GuildRepository.findOne({ where: { guildId: interaction.guildId } });

        interaction.followUp({ content: "User has been denied and kicked from the server", ephemeral: true });

        if (guild?.logsChannel) {
            var log = await interaction.guild.channels.fetch(guild.logsChannel) as TextChannel;
            if (!log) return;

            var user = await client.users.fetch(userId);

            var em = new EmbedBuilder()
                .setTitle("Denied User")
                .setThumbnail(user.avatarURL())
                .addFields(
                    { name: "User", value: `<@${user.id}>\n${user.username}` },
                    { name: "Denied By", value: `<@${interaction.member.user.id}>\n${interaction.member.user.username}` },
                )
                .setColor(0xFF474D)

            await log.send({
                embeds: [em]
            });
        }
    }
}