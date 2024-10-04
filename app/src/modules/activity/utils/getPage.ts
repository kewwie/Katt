import { 
    ActionRowBuilder,
    StringSelectMenuBuilder,
    User
} from "discord.js";
import { KiwiClient } from "../../../client";
import { Emojis } from "../../../emojis";

import { ActivitySelectMenu as ActivitySM } from "../selectmenus/activityType"

export const getPage = async (
    client: KiwiClient,
    config: {
        guildId: string;
        pageId: string;
        pageOwner?: User;
        user?: User;
    }
) => {
    const { guildId, pageId, pageOwner, user } = config;
    var guild = await client.guilds.fetch(guildId);

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
            var embedDescription = [
                `### Voice Activity`,
                `${Emojis.ReplyTop} `,
                `${Emojis.ReplyMiddle} `,
                `${Emojis.ReplyBottom} `,
            ];
            break;
        }
    }

    embeds.push(
        client.Pages.generateEmbed({
            author: { 
                name: client.capitalize(user.username), 
                iconURL: user.avatarURL()
            },
            description: embedDescription.join("\n"),
            //thumbnail: guild.iconURL(),
            footer: { 
                text: `Requested by ${client.capitalize(pageOwner.username)}`,
                iconURL: pageOwner.avatarURL()
            }
        })
    );

    var { options } = ActivitySM.config as StringSelectMenuBuilder;
    var moduleSelectMenu = client.Pages.generateSelectMenu({
        customId: client.createCustomId({ customId: ActivitySM.customId, ownerId: pageOwner.id }),
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