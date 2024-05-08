import { KiwiClient } from "../../../client";

import { 
    ButtonStyle,
    ComponentType,
    ButtonInteraction,
    TextChannel
} from "discord.js";

import { Button } from "../../../types/component";

import { dataSource } from "../../../data/datasource";
import { GuildConfig } from "../../../data/entities/GuildConfig";

export const UpdateList: Button = {
    config: {
        type: ComponentType.Button,
        custom_id: "update-list",
        style: ButtonStyle.Primary,
        
    },
    
    /**
    * @param {ButtonInteraction} interaction
    * @param {Client} client
    */
    async execute(interaction: ButtonInteraction, client: KiwiClient) {
        const GuildRepository = await dataSource.getRepository(GuildConfig);

        var userToMove = interaction.customId.split("_")[1];
        var users = interaction.message.content.split("\n");

        let index = users.indexOf(userToMove);
    
        if (index !== -1) {
            users.splice(index, 1);
            users.push(userToMove);
        }
        
        var content = users.join("\n");

        interaction.message.edit({ content });
        interaction.reply({ content: `Moved **${userToMove}** to the bottom of the list!`, ephemeral: true });

        var guild = await GuildRepository.findOne({ where: { guildId: interaction.guild.id } });

        if (guild.logsChannel) {
            var log = await interaction.guild.channels.fetch(guild.logsChannel) as TextChannel;
            if (!log) return;
            
            await log.send(`<@${interaction.user.id}> has moved down **${userToMove}** in [${interaction.channel.name}](${interaction.message.url})`);
        }
    }
}