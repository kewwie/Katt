import { ChannelType, Guild } from "discord.js";
import { KiwiClient } from "../../../client";
import { Loop } from "../../../types/loop";

import { dataSource } from "../../../datasource";
import { CustomChannelEntity } from "../../../entities/CustomChannel";

export const DeleteChannels: Loop = {
    name: "DeleteChannels",
    seconds: 60 * 5,

    /**
     * @param {KiwiClient} client
     * @param {Guild} guild
     */
    async execute(client: KiwiClient, guild: Guild) {
        const CustomChannelsRepository = await dataSource.getRepository(CustomChannelEntity);

        var customChannels = await CustomChannelsRepository.find({ where: { guildId: guild.id } });
        for (let customChannel of customChannels) {
            var channel = await guild.channels.fetch(customChannel.channelId).catch(() => {});
            if (channel && channel.type === ChannelType.GuildVoice) {
                var members = channel.members.map(member => member.user);
                var ownerChannel = (await guild.channels.fetch()).find(channel => channel.type === ChannelType.GuildVoice && channel.members.has(customChannel.userId));

                if (members.length === 0 && !ownerChannel) {
                    CustomChannelsRepository.update({ channelId: channel.id }, { channelId: null });
                    await channel.delete("No members in channel").catch(() => {});
                }
            } else {
                CustomChannelsRepository.update({ _id: customChannel._id }, { channelId: null });
            }
        }
    }
}