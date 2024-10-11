import { 
    ActionRowBuilder,
    StringSelectMenuBuilder,
    User
} from "discord.js";
import { KiwiClient } from "../../../client";

import { ActivitySelectMenu as ActivitySM } from "../selectmenus/activityType"
import { createVoiceLeaderboard } from "./createVoiceLeaderboard";

export const getLeaderboardPage = async (
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
        case "voice": {
            var content = (await createVoiceLeaderboard(client, guildId, "daily")).content;
            break;
        }
    }

    var { options } = ActivitySM.config as StringSelectMenuBuilder;
    var moduleSelectMenu = client.Pages.generateSelectMenu({
        customId: client.createCustomId({ customId: ActivitySM.customId, ownerId: pageOwner.id, userId: user.id }),
        placeholder: "Select an Leaderboard Type",
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

    return { content, rows };
}