import { 
    ActionRowBuilder,
    StringSelectMenuBuilder,
    User
} from "discord.js";
import { KiwiClient } from "../../../client";
import { Emojis } from "../../../emojis";

import { ActivitySelectMenu as ActivitySM } from "../selectmenus/activityType"
import { getVoice } from "./getVoice";

export const getPage = async (
    client: KiwiClient,
    config: {
        guildId: string;
        pageId: string;
        pageOwner: User;
        user: User;
    }
) => {
    const { guildId, pageId, pageOwner, user } = config;
    var guild = await client.guilds.fetch(guildId);

    const hours = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
    });
    const minutes = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });

    var embeds = [];
    var rows = [];

    switch (pageId) {
        case "status": {
            var embedDescription = [
                `### Status Activity`,
                `${Emojis.ReplyTop} COMING`,
                `${Emojis.ReplyMiddle} SOON`,
                `${Emojis.ReplyBottom} NOT YET`,
            ];
            break;
        }

        case "voice": {
            var voice = await getVoice(client, guildId, user.id);
            var embedDescription = [
                `### Voice Activity`,
                `${Emojis.ReplyTop} **Total:** ${hours.format(voice.totalSeconds / (60 * 60))} Hours / ${minutes.format(voice.totalSeconds / 60)} Minutes`,
                `${Emojis.ReplyMiddle} **Daily:** ${hours.format(voice.dailySeconds / (60 * 60))} Hours / ${minutes.format(voice.dailySeconds / 60)} Minutes`,
                `${Emojis.ReplyMiddle} **Weekly:** ${hours.format(voice.weeklySeconds / (60 * 60))} Hours / ${minutes.format(voice.weeklySeconds / 60)} Minutes`,
                `${Emojis.ReplyBottom} **Monthly:** ${hours.format(voice.monthlySeconds / (60 * 60))} Hours / ${minutes.format(voice.monthlySeconds / 60)} Minutes`,
            ];
            break;
        }
    }

    embeds.push(
        client.Pages.generateEmbed({
            author: { 
                name: `${client.capitalize(user.displayName)} (${client.capitalize(user.username)})`, 
                iconURL: user.avatarURL()
            },
            description: embedDescription.join("\n"),
            thumbnail: guild.iconURL(),
            footer: { 
                text: `Requested by ${client.capitalize(pageOwner.username)}`,
                iconURL: pageOwner.avatarURL()
            }
        })
    );

    var { options } = ActivitySM.config as StringSelectMenuBuilder;
    var moduleSelectMenu = client.Pages.generateSelectMenu({
        customId: client.createCustomId({ customId: ActivitySM.customId, ownerId: pageOwner.id, userId: user.id }),
        placeholder: "Select an Activity Type",
        options: options.map(option => { 
            return { label: option.data.label, value: option.data.value, description: option.data.description } 
        }),
        defaults: [pageId],
        type: "string",
    })

    rows.push(
        new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(moduleSelectMenu)
    );

    return { embeds, rows };
}