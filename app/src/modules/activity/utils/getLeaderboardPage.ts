import { 
    ActionRowBuilder,
    StringSelectMenuBuilder,
    User
} from "discord.js";
import { KiwiClient } from "../../../client";

import { LeaderboardTypeSelectMenu as LeaderboardTypeSM } from "../selectmenus/leaderboardType"
import { LeaderboardTimeSelectMenu as LeaderboardTimeSM } from "../selectmenus/leaderboardTime"
import { createVoiceLeaderboard } from "./createVoiceLeaderboard";

export const getLeaderboardPage = async (
    client: KiwiClient,
    config: {
        guildId: string;
        pageId: string;
        time: string;
        pageOwner: User;
    }
) => {
    const { guildId, pageId, time, pageOwner } = config;

    var rows = [];

    switch (pageId) {
        case "voice": {
            var content = (await createVoiceLeaderboard(client, guildId, time)).content;
            break;
        }
    }

    var { options } = LeaderboardTypeSM.config as StringSelectMenuBuilder;
    var typeSelectMenu = client.Pages.generateSelectMenu({
        customId: client.createCustomId({ 
            customId: LeaderboardTypeSM.customId,
            valueOne: time,
            ownerId: pageOwner.id
        }),
        placeholder: LeaderboardTypeSM.config.data.placeholder,
        options: options.map(option => { 
            return { label: option.data.label, value: option.data.value, description: option.data.description } 
        }),
        defaults: [pageId],
        type: "string",
    })

    var { options } = LeaderboardTimeSM.config as StringSelectMenuBuilder;
    var timeSelectMenu = client.Pages.generateSelectMenu({
        customId: client.createCustomId({ 
            customId: LeaderboardTimeSM.customId,
            valueOne: pageId,
            ownerId: pageOwner.id
        }),
        placeholder: LeaderboardTimeSM.config.data.placeholder,
        options: options.map(option => { 
            return { label: option.data.label, value: option.data.value, description: option.data.description } 
        }),
        defaults: [time],
        type: "string",
    })

    rows.push(
        new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(typeSelectMenu),
        new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(timeSelectMenu)
    );

    return { content, rows };
}