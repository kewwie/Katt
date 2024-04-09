import { ButtonInteraction } from "discord.js";
import { KiwiClient } from "../client";
import { Button, ButtonStyles, ComponentTypes } from "../types/component";

export const button: Button = {
    config: {
        custom_id: "update-list_",
        type: ComponentTypes.Button,
        style: ButtonStyles.Primary,
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