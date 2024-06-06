import { KiwiClient } from "../../../client";
import { Events, Event } from "../../../types/event";

import {
    CategoryChannelResolvable,
    ChannelType,
    VoiceState
} from "discord.js";

import { dataSource } from "../../../datasource";
import { CustomChannels } from "../../../entities/CustomChannels";
import { GuildConfig } from "../../../entities/GuildConfig";

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
        const CustomChannelsRepository = await dataSource.getRepository(CustomChannels);
        const GuildConfigRepository = await dataSource.getRepository(GuildConfig);

        var customChannel = await CustomChannelsRepository.findOne({
            where: {
                guildId: newVoiceState.guild.id,
                userId: newVoiceState.member.id
            }
        });
        var guildConfig = await GuildConfigRepository.findOne({ where: { guildId: newVoiceState.guild.id } });
        var roles = newVoiceState.member.roles.cache.map(role => role.id);

        if (customChannel && customChannel.channelId) {
            var channel = await newVoiceState.guild.channels.fetch(customChannel.channelId).catch(() => {});
            if (!channel) {
                customChannel.channelId = null;
                await CustomChannelsRepository.save(customChannel);
            }
        }

        if (
            guildConfig &&
            (roles.includes(guildConfig.adminRole) ||
            roles.includes(guildConfig.memberRole)) ||
            newVoiceState.channelId === guildConfig.voiceChannel
        ) {
            if (
                customChannel &&
                customChannel.channelId &&
                newVoiceState.channelId === guildConfig.voiceChannel
            ) {
                var channel = await newVoiceState.guild.channels.fetch(customChannel.channelId).catch(() => {});
                if (channel) {
                    newVoiceState.setChannel(customChannel.channelId, "Moved to their own channel");
                }
            }

            if (customChannel && !customChannel.channelId && newVoiceState.channelId) {
                var newChannel = await newVoiceState.guild.channels.create({
                    name: !customChannel.name ? `${newVoiceState.member.displayName}'s Channel` : customChannel.name,
                    type: ChannelType.GuildVoice,
                    parent: await newVoiceState.guild.channels.fetch(guildConfig.voiceCategory) as CategoryChannelResolvable,
                    permissionOverwrites: [
                        {
                            id: newVoiceState.member.id,
                            allow: ['ViewChannel', 'Connect', 'Speak', 'ManageChannels']
                        }
                    ]
                });
                
                customChannel.channelId = newChannel.id;
                await CustomChannelsRepository.save(customChannel);

                if (newVoiceState.channelId === guildConfig.voiceChannel) {
                    newVoiceState.setChannel(newChannel, "Moved to their own channel");
                }
            }

            else if (!customChannel && newVoiceState.channelId) {
                var newChannel = await newVoiceState.guild.channels.create({
                    name: `${newVoiceState.member.displayName}'s Channel`,
                    type: ChannelType.GuildVoice,
                    parent: await newVoiceState.guild.channels.fetch(guildConfig.voiceCategory) as CategoryChannelResolvable,
                    permissionOverwrites: [
                        {
                            id: newVoiceState.member.id,
                            allow: ['ViewChannel', 'Connect', 'Speak', 'ManageChannels']
                        }
                    ]
                });

                CustomChannelsRepository.insert({
                    guildId: newVoiceState.guild.id,
                    userId: newVoiceState.member.id,
                    channelId: newChannel.id,
                    name: `${newVoiceState.member.displayName}'s Channel`
                });

                if (newVoiceState.channelId === guildConfig.voiceChannel) {
                    newVoiceState.setChannel(newChannel, "Moved to their own channel");
                }
            }
        }
    }
}