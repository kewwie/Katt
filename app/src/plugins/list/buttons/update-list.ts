import { KiwiClient } from "../../../client";

import { 
    ButtonStyle,
    ComponentType,
    ButtonInteraction
} from "discord.js";

import { Button } from "../../../types/component";

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

        /*const guild = await client.database.db("kiwi").collection("guilds").findOne(
            { guildId: interaction.guildId }
        );

        if (guild && guild.logsChannel) {
            var log = await interaction.guild?.channels.cache.get(guild.logsChannel);
            if (log && log.type === ChannelType.GuildText) {
                await log.send(`<@${interaction.user.id}> has moved down **${userToMove}** in [${interaction.channel.name}](${interaction.message.url})`);
            }
        }*/
    }
}