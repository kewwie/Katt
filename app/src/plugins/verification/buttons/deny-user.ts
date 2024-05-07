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
import { Guild } from "../../../data/entities/Guild";

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
        var memberId = interaction.customId.split("_")[1];
        var member = await interaction.guild.members.fetch(memberId);

        const GuildRepository = await dataSource.getRepository(Guild);

        await member.send(`You have been **denied** from **${interaction.guild.name}**`)
        await member.kick("Denied by a moderator.");
        var message = await interaction.channel.messages.fetch(interaction.message.id);
        if (message) {
            await message.delete();
        }

        const guild = await GuildRepository.findOne({ where: { guildId: member.guild.id } });

        if (guild?.logsChannel) {
            var log = await interaction.guild.channels.cache.get(guild.logsChannel) as TextChannel;

            var em = new EmbedBuilder()
                .setTitle(member.user.username + "#" + member.user.discriminator)
                .setThumbnail(member.user.avatarURL())
                .addFields(
                    { name: "Mention", value: `<@${member.user.id}>` },
                    { name: "Denied By", value: `<@${interaction.member.user.id}>` },
                    { name: "Action", value: "Kicked" }
                )
                .setColor(0xFF474D)

            await log.send({
                embeds: [em]
            });
        }
    }
}