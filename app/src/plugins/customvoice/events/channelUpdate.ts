import { GuildChannel } from "discord.js";

import { KiwiClient } from "../../../client";
import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { CustomChannels } from "../../../entities/CustomChannels";

/**
 * @type {Event}
 */
export const ChannelUpdate: Event = {
    name: Events.ChannelUpdate,

    /**
     * @param {Guild} guild
     */
    async getGuildId(channel: GuildChannel) {
        return channel.guild.id;
    },

    /**
    * @param {KiwiClient} client
    * @param {Guild} guild
    */
    async execute(client: KiwiClient, oldChannel: GuildChannel, newChannel: GuildChannel) {
        const CustomChannelsRepository = await dataSource.getRepository(CustomChannels);

        var customChannel = await CustomChannelsRepository.findOne({
            where: {
                guildId: newChannel.guild.id,
                channelId: newChannel.id
            }
        });

        if (customChannel && customChannel.name !== newChannel.name) {
            CustomChannelsRepository.update({ channelId: newChannel.id }, { name: newChannel.name });
        }
    }
}