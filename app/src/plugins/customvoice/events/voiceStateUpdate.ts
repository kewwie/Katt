import { KiwiClient } from "../../../client";
import { Events, Event } from "../../../types/event";

import {
    CategoryChannel,
    ChannelType,
    VoiceState
} from "discord.js";

import { dataSource } from "../../../datasource";
import { CustomChannelEntity } from "../../../entities/CustomChannel";
import { GuildConfigEntity } from "../../../entities/GuildConfig";
import { GuildUserEntity } from "../../../entities/GuildUser";

/**
 * @type {Event}
 */
export const VoiceStateUpdate: Event = {
    name: Events.VoiceStateUpdate,

    /**
     * @param {VoiceState} voiceState
     */
    async getGuildId(voiceState: VoiceState) {
        return voiceState.guild.id;
    },

    /**
    * @param {KiwiClient} client
    * @param {VoiceState} oldVoiceState
    * @param {VoiceState} newVoiceState
    */
    async execute(client: KiwiClient, oldVoiceState: VoiceState, newVoiceState: VoiceState) {
        const CustomChannelRepository = await dataSource.getMongoRepository(CustomChannelEntity);
        const GuildConfigRepository = await dataSource.getMongoRepository(GuildConfigEntity);
        const GuildUserRepository = await dataSource.getMongoRepository(GuildUserEntity);

        if (newVoiceState.member.user.bot) return;

        var customChannel = await CustomChannelRepository.findOne({
            where: {
                guildId: newVoiceState.guild.id,
                userId: newVoiceState.member.id
            }
        });

        var guildConfig = await GuildConfigRepository.findOne({ where: { guildId: newVoiceState.guild.id } });
        var isStaff = (await GuildUserRepository.findOne({ where: { guildId: newVoiceState.guild.id, userId: newVoiceState.member.id  } })).level <= 3;

        if (customChannel && customChannel.channelId) {
            var channel = await newVoiceState.guild.channels.fetch(customChannel.channelId).catch(() => {});
            if (!channel) {
                customChannel.channelId = null;
                await CustomChannelRepository.save(customChannel);
            }
        }

        if (
            guildConfig &&
            isStaff ||
            newVoiceState.channelId === guildConfig.customChannel
        ) {
            if (
                customChannel &&
                customChannel.channelId &&
                newVoiceState.channelId === guildConfig.customChannel
            ) {
                var channel = await newVoiceState.guild.channels.fetch(customChannel.channelId).catch(() => {});
                if (channel) {
                    newVoiceState.setChannel(customChannel.channelId, "Moved to their own channel").catch(() => {});
                }
            }

            if (customChannel && !customChannel.channelId && newVoiceState.channelId) {
                var category = await newVoiceState.guild.channels.fetch(guildConfig.customCategory) as CategoryChannel;
                var newChannel = await newVoiceState.guild.channels.create({
                    name: !customChannel.channelName ? `${newVoiceState.member.displayName}'s Channel` : customChannel.channelName,
                    type: ChannelType.GuildVoice,
                    parent: category,
                    permissionOverwrites: [
                        ...category.permissionOverwrites.cache.map(overwrite => ({
                            id: overwrite.id,
                            allow: overwrite.allow.toArray(),
                            deny: overwrite.deny.toArray()
                        })),
                        {
                            id: newVoiceState.member.id,
                            allow: ['ViewChannel', 'Connect', 'Speak', 'ManageChannels']
                        }
                    ]
                });
                
                customChannel.channelId = newChannel.id;
                await CustomChannelRepository.save(customChannel);

                if (newVoiceState.channelId === guildConfig.customChannel) {
                    newVoiceState.setChannel(newChannel, "Moved to their own channel").catch(() => {});
                }
            }

            else if (!customChannel && newVoiceState.channelId) {
                var category = await newVoiceState.guild.channels.fetch(guildConfig.customCategory) as CategoryChannel;
                var newChannel = await newVoiceState.guild.channels.create({
                    name: `${newVoiceState.member.displayName}'s Channel`,
                    type: ChannelType.GuildVoice,
                    parent: category,
                    permissionOverwrites: [
                        ...category.permissionOverwrites.cache.map(overwrite => ({
                            id: overwrite.id,
                            allow: overwrite.allow.toArray(),
                            deny: overwrite.deny.toArray()
                        })),
                        {
                            id: newVoiceState.member.id,
                            allow: ['ViewChannel', 'Connect', 'Speak', 'ManageChannels']
                        }
                    ]
                });

                CustomChannelRepository.insert({
                    guildId: newVoiceState.guild.id,
                    userId: newVoiceState.member.id,
                    channelId: newChannel.id,
                    channelName: `${newVoiceState.member.displayName}'s Channel`
                });

                if (newVoiceState.channelId === guildConfig.customChannel) {
                    newVoiceState.setChannel(newChannel, "Moved to their own channel").catch(() => {});
                }
            }
        }
    }
}