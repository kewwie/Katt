import { ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, User } from "discord.js";
import { KiwiClient } from "../../../client";
import { Emojis } from "../../../emojis";

import { ConfigSelectMenu } from "../selectmenus/configType"

import { generateModuleButtons } from "./generateModuleButtons";

export const getPage = async (
    client: KiwiClient,
    config: {
        guildId: string;
        pageId: string;
        pageOwner?: User;
    }
) => {
    const { guildId, pageId, pageOwner } = config;
    var guild = await client.guilds.fetch(guildId);
    var isEnabled = await client.db.repos.guildModules
        .findOneBy({ guildId: guildId, moduleId: pageId });

    var embeds = [];
    var rows = [];

    switch (pageId) {
        case "overview": {
            var owner = await client.users.fetch(guild.ownerId);
            var embedDescription = [
                `### Guild Overview`,
                `${Emojis.ReplyTop} **Owner:** ${owner.displayName} (${owner.username})`,
                `${Emojis.ReplyMiddle} **Members:** ${guild.memberCount}`,
                `${Emojis.ReplyBottom} **Ping:** ${Math.round(client.ws.ping)}ms`,
            ];
            break;
        }

        case "activity": {
            var actConf = await client.db.repos.activityConfig
                    .findOneBy({ guildId: guildId });
            var embedDescription = [
                `### Activity Module`,
                `${Emojis.ReplyTop} **Enabled:** ${isEnabled ? 'True' : 'False'}`,
                `${Emojis.ReplyMiddle} **Log Channel:** ${actConf?.logChannel ? `<#${actConf.logChannel}>` : 'None'}`,
                `${Emojis.ReplyMiddle} **Most Active Role:** ${actConf?.mostActiveRole ? `<@&${actConf.mostActiveRole}>` : 'None'}`,
                `${Emojis.ReplyMiddle} **Daily Active Role:** ${actConf?.dailyMostActiveRole ? `<@&${actConf.dailyMostActiveRole}>` : 'None'}`,
                `${Emojis.ReplyMiddle} **Weekly Active Role:** ${actConf?.weeklyMostActiveRole ? `<@&${actConf.weeklyMostActiveRole}>` : 'None'}`,
                `${Emojis.ReplyBottom} **Monthly Active Role:** ${actConf?.monthlyMostActiveRole ? `<@&${actConf.monthlyMostActiveRole}>` : 'None'}`,                
            ];

            rows.push(new ActionRowBuilder<ButtonBuilder>()
                .addComponents(generateModuleButtons(client, { pageId, pageOwner }))
            );
            break;
        }
    }

    embeds.push(
        client.Pages.generateEmbed({
            title: "Server Configuration",
            description: embedDescription.join("\n"),
            thumbnail: guild.iconURL(),
            user: pageOwner,
        })
    );

    var { options } = ConfigSelectMenu.config as StringSelectMenuBuilder;
    var moduleSelectMenu = client.Pages.generateSelectMenu({
        customId: client.createCustomId({ customId: ConfigSelectMenu.customId, ownerId: pageOwner.id }),
        placeholder: "Select a module",
        options: options.map(option => { 
            return { label: option.data.label, value: option.data.value, description: option.data.description } 
        }),
        type: "string",
    })

    rows.push(
        new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(moduleSelectMenu)
    );

    return { embeds, rows };
}