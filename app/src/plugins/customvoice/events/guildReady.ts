import { CategoryChannelResolvable, ChannelType, Guild } from "discord.js";

import { KiwiClient } from "../../../client";
import { Event, Events } from "../../../types/event";

import { dataSource } from "../../../datasource";
import { CustomChannelEntity } from "../../../entities/CustomChannel";
import { GuildConfigEntity } from "../../../entities/GuildConfig";

/**
 * @type {Event}
 */
export const GuildReady: Event = {
    name: Events.GuildReady,

    /**
     * @param {Guild} guild
     */
    async getGuildId(guild: Guild) {
        return guild.id;
    },

    /**
    * @param {KiwiClient} client
    * @param {Guild} guild
    */
    async execute(client: KiwiClient, guild: Guild) {
        const CustomChannelRepository = await dataSource.getRepository(CustomChannelEntity);
        const GuildConfigRepository = await dataSource.getRepository(GuildConfigEntity);

        var customChannels = await CustomChannelRepository.find({ where: { guildId: guild.id } });
        for (let customChannel of customChannels) {
            var channel = await guild.channels.fetch(customChannel.channelId).catch(() => {});
            if (channel && channel.type === ChannelType.GuildVoice) {
                var members = channel.members.map(member => member.user);
                var ownerChannel = (await guild.channels.fetch()).find(channel => channel.type === ChannelType.GuildVoice && channel.members.has(customChannel.userId));

                if (members.length === 0 && !ownerChannel) {
                    await channel.delete("No members in channel").catch(() => {});
                    CustomChannelRepository.update({ channelId: channel.id }, { channelId: null });
                }
            }
        }

        for (let voiceState of guild.voiceStates.cache) {
            var vs = voiceState[1];

            var guildConfig = await GuildConfigRepository.findOne({ where: { guildId: guild.id } });
            var roles = vs.member.roles.cache.map(role => role.id);

            if (customChannel && customChannel.channelId) {
                var channel = await vs.guild.channels.fetch(customChannel.channelId).catch(() => {});
                if (!channel) {
                    customChannel.channelId = null;
                    await CustomChannelRepository.save(customChannel);
                }
            }
            
            if (
                guildConfig &&
                (roles.includes(guildConfig.adminRole) ||
                roles.includes(guildConfig.memberRole)) ||
                vs.channelId === guildConfig.voiceChannel
            ) {
                var customChannel = await CustomChannelRepository.findOne({ where: { guildId: guild.id, userId: vs.member.id } });
                if (
                    customChannel &&
                    customChannel.channelId &&
                    vs.channelId === guildConfig.voiceChannel
                ) {
                    var channel = await guild.channels.fetch(customChannel.channelId).catch(() => {});
                    if (channel) {
                        vs.setChannel(customChannel.channelId, "Moved to their own channel");
                    }
                }

                else if (customChannel && !customChannel.channelId && vs.channelId) {
                    var newChannel = await vs.guild.channels.create({
                        name: !customChannel.channelName ? `${vs.member.displayName}'s Channel` : customChannel.channelName,
                        type: ChannelType.GuildVoice,
                        parent: await vs.guild.channels.fetch(guildConfig.voiceCategory) as CategoryChannelResolvable,
                        permissionOverwrites: [
                            {
                                id: vs.member.id,
                                allow: ['ViewChannel', 'Connect', 'Speak', 'ManageChannels']
                            }
                        ]
                    });
                    
                    customChannel.channelId = newChannel.id;
                    await CustomChannelRepository.save(customChannel);

                    if (vs.channelId === guildConfig.voiceChannel) {
                        vs.setChannel(newChannel, "Moved to their own channel");
                    }
                }

                else if (!customChannel && vs.channelId) {
                    var newChannel = await vs.guild.channels.create({
                        name: `${vs.member.displayName}'s Channel`,
                        type: ChannelType.GuildVoice,
                        parent: await vs.guild.channels.fetch(guildConfig.voiceCategory) as CategoryChannelResolvable,
                        permissionOverwrites: [
                            {
                                id: vs.member.id,
                                allow: ['ViewChannel', 'Connect', 'Speak', 'ManageChannels']
                            }
                        ]
                    });

                    CustomChannelRepository.insert({
                        guildId: vs.guild.id,
                        userId: vs.member.id,
                        channelId: newChannel.id,
                        channelName: `${vs.member.displayName}'s Channel`
                    });

                    if (vs.channelId === guildConfig.voiceChannel) {
                        vs.setChannel(newChannel, "Moved to their own channel");
                    }
                }
            }
        } 
    }
}