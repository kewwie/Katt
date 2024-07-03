import { KiwiClient } from "../../../client";

import { 
    ButtonStyle,
    ComponentType,
    ButtonInteraction,
    TextChannel,
    EmbedBuilder
} from "discord.js";

import { Button } from "../../../types/component";

import { dataSource } from "../../../datasource";
import { GuildConfigEntity } from "../../../entities/GuildConfig";

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
        const GuildConfigRepository = await dataSource.getRepository(GuildConfigEntity);
        let guildConfig = await GuildConfigRepository.findOne({ where: { guildId: interaction.guild.id } });
        
        await interaction.deferReply({ ephemeral: true });
        var userId = interaction.customId.split("_")[1];
        var modId = interaction.customId.split("_")[2];

        if (interaction.user.id !== modId) {
            interaction.followUp({ content: "You are not the owner of this command!", ephemeral: true });
            return;
        }

        await interaction.guild.members.kick(userId, "User was kicked by a moderator").catch(() => {});
        interaction.message.edit({ content: "User was kicked!", components: [] });

        if (guildConfig.logChannel) {
            var log = await interaction.guild.channels.fetch(guildConfig.logChannel) as TextChannel;
            if (!log) return;

            let u = await interaction.client.users.fetch(userId);
            if (!u) return;

            var LogEmbed = new EmbedBuilder()
                .setTitle("Demoted & Kicked User")
                .setThumbnail(u.avatarURL())
                .setColor(0x90EE90)
                .addFields(
                    { name: "User", value: `<@${u.id}>\n${u.username}` },
                    { name: "By", value: `<@${interaction.user.id}>\n${interaction.user.username}` }
                )

            await log.send({
                embeds: [LogEmbed]
            });
        }
    }
}