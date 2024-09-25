
import { 
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction
} from "discord.js";
import { KiwiClient } from "../client";
import { SelectMenu } from "../types/component";

/**
 * @type {SelectMenu}
 */
export const ConfigChannelSelectMenu: SelectMenu = {
    customId: 'config-channel',
    config: new ChannelSelectMenuBuilder()
        .setMinValues(0)
        .setMaxValues(1),
    execute: async (interaction: ChannelSelectMenuInteraction, client: KiwiClient) => {
        interaction.reply("ok");
    }
}