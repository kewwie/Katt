import { KiwiClient } from "../../../client";

import { 
    ButtonStyle,
    ComponentType,
    ButtonInteraction,
    EmbedBuilder,
    TextChannel
} from "discord.js";

import { Button } from "../../../types/component";

import { dataSource } from "../../../data/datasource";
import { GuildConfig } from "../../../data/entities/GuildConfig";

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
        interaction.deferUpdate();
        const GuildRepository = await dataSource.getRepository(GuildConfig);

        var memberId = interaction.customId.split("_")[1];

        var message = await interaction.channel.messages.fetch(interaction.message.id);
        if (message) {
            await message.delete();
        }

        const guild = await GuildRepository.findOne({ where: { guildId: interaction.guildId } });

        if (guild?.logsChannel) {
            var log = await interaction.guild.channels.fetch(guild.logsChannel) as TextChannel;
            if (!log) return;

            var user = await client.users.fetch(memberId);

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