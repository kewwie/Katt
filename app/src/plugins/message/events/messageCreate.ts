import { KiwiClient } from "../../../client";
import { Events, Event } from "../../../types/event";

import {
    Message
} from "discord.js";

import { dataSource } from "../../../data/datasource";
import { MessageActivity } from "../../../data/entities/MessageActivity";

import { MessagePlugin } from "..";

/**
 * @type {Event}
 */
export const MessageCreate: Event = {
    name: Events.MessageCreate,

    /**
     * @param {Message} message
     */
    async getGuildId(message: Message) {
        return message.guild.id;
    },

    /**
    * @param {KiwiClient} client
    * @param {Message} message
    */
    async execute(client: KiwiClient, message: Message) {
        const MessageActivityRepository = await dataSource.getRepository(MessageActivity);

        var ma = await MessageActivityRepository.findOne(
            { where: { userId: message.author.id, guildId: message.guild.id }}
        );

        if (ma) {
            await MessageActivityRepository.update(
                { 
                    guildId: message.guild.id,
                    userId: message.author.id,
                    username: message.author.username
                },
                { messages: ma.messages + 1 }
            );
        } else {
            await MessageActivityRepository.insert({ 
                guildId: message.guild.id,
                userId: message.author.id,
                username: message.author.username,
                messages: 1
            });
        }
    }
}