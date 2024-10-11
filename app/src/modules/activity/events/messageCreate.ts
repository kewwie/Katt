import { Message } from "discord.js";
import { KiwiClient } from "../../../client";
import { Event, EventList } from "../../../types/event";

/**
 * @type {Event}
 */
export const MessageCreate: Event = {
    name: EventList.MessageCreate,

    /**
     * @param {KiwiClient} client
     * @param {VoiceState} oldVoiceState
     */
    async getGuildId(message: Message) {
        return message.guild.id;
    },

    /**
    * @param {KiwiClient} client
    * @param {VoiceState} oldVoiceState
    * @param {VoiceState} newVoiceState
    */
    async execute(client: KiwiClient, message: Message) {
        if (message.member.user.bot) return;

        var existingRecord = await client.db.repos.activityMessages.findOne({
            where: {
                guildId: message.guild.id,
                userId: message.author.id
            }
        });

        var totalMessages = existingRecord ? existingRecord.totalMessages + 1 : 1;
        var dailyMessages = existingRecord ? existingRecord.dailyMessages + 1 : 1;
        var weeklyMessages = existingRecord ? existingRecord.weeklyMessages + 1 : 1;
        var monthlyMessages = existingRecord ? existingRecord.monthlyMessages + 1 : 1;


        await client.db.repos.activityMessages.upsert({
            guildId: message.guild.id,
            userId: message.author.id,
            userName: message.author.username,
            totalMessages: totalMessages,
            dailyMessages: dailyMessages,
            weeklyMessages: weeklyMessages,
            monthlyMessages: monthlyMessages
        }, ['guildId', 'userId']);
    }
}