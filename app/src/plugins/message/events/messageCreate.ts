import { KiwiClient } from "../../../client";
import { Events, Event } from "../../../types/event";

import {
    Message
} from "discord.js";

import { dataSource } from "../../../datasource";
import { MessageActivityEntity } from "../../../entities/MessageActivity";

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
        const MessageActivityRepository = await dataSource.getRepository(MessageActivityEntity);

        if (message.author.bot) return;

        var ma = await MessageActivityRepository.findOne(
            { where: { userId: message.author.id, guildId: message.guild.id }}
        );

        if (ma) {
            await MessageActivityRepository.update(
                { 
                    guildId: message.guild.id,
                    userId: message.author.id,
                    userName: message.author.username
                },
                { amount: ma.amount + 1 }
            );
        } else {
            await MessageActivityRepository.insert({ 
                guildId: message.guild.id,
                userId: message.author.id,
                userName: message.author.username,
                amount: 1
            });
        }
    }
}