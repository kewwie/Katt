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
import { GuildConfigEntity } from "../../../entities/GuildConfig";
import { PendingMessageEntity } from "../../../entities/PendingMessage";

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
        const GuildConfigRepository = await dataSource.getRepository(GuildConfigEntity);
        const PendingMessageRepository = await dataSource.getRepository(PendingMessageEntity);

        var userId = interaction.customId.split("_")[1];

        var message = await interaction.channel.messages.fetch(interaction.message.id);
        if (message) {
            await message.delete();
        }
        PendingMessageRepository.delete({ guildId: interaction.guild.id, userId: userId });

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

        const guild = await GuildConfigRepository.findOne({ where: { guildId: interaction.guildId } });

        interaction.followUp({ content: "User has been denied and kicked from the server", ephemeral: true });

        if (guild?.logChannel) {
            var log = await interaction.guild.channels.fetch(guild.logChannel) as TextChannel;
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