import { GuildChannel } from "discord.js";

import { KiwiClient } from "../../../client";
import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { CustomChannelEntity } from "../../../entities/CustomChannel";

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
        const CustomChannelRepository = await dataSource.getMongoRepository(CustomChannelEntity);

        var customChannel = await CustomChannelRepository.findOne({
            where: {
                guildId: newChannel.guild.id,
                channelId: newChannel.id
            }
        });

        if (customChannel && customChannel.channelName !== newChannel.name) {
            CustomChannelRepository.update({ channelId: newChannel.id }, { channelName: newChannel.name });
        }
    }
}