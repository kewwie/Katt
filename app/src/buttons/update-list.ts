import {
    ButtonInteraction
} from "discord.js";
import { env } from "../env";
import { KiwiClient } from "../client";

module.exports = {
    data: {
        id: "update-list",
    },
    /**
    * 
    * @param {ButtonInteraction} interaction
    * @param {Client} client
    */
    async execute(interaction: ButtonInteraction, client: KiwiClient) {
        var userToMove = interaction.customId.split("_")[1];
        var users = interaction.message.content.split("\n");

        let index = users.indexOf(userToMove);
    
        if (index !== -1) {
            users.splice(index, 1);
            users.push(userToMove);
        }
        
        var content = users.join("\n");
        
        interaction.update({ content });

        const guild = await client.database.db("kiwi").collection("guilds").findOne(
            { guildId: interaction.guildId }
        );

        if (guild && guild.logsChannel) {
            var log = await interaction.guild?.channels.cache.get(guild.logsChannel);
            if (log && log.type === 'GUILD_TEXT') {
                await log.send(`<@${interaction.user.id}> has moved down **${userToMove}** in [${interaction.channel?.name}](${interaction.message.url})`);
            }
        }
    }
}