import { ActionRowBuilder, ButtonBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, StringSelectMenuBuilder, User } from "discord.js";
import { KiwiClient } from "../../../client";
import { Emojis } from "../../../emojis";

import { ConfigSelectMenu } from "../selectmenus/configType"
import { ConfigChannelSelectMenu as ChannelSM } from "../selectmenus/configChannel";
import { ConfigRoleSelectMenu as RoleSM } from "../selectmenus/configRole";

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
                `${Emojis.ReplyMiddle} **Daily Active Role:** ${actConf?.dailyActiveRole ? `<@&${actConf.dailyActiveRole}>` : 'None'}`,
                `${Emojis.ReplyBottom} **Weekly Active Role:** ${actConf?.weeklyActiveRole ? `<@&${actConf.weeklyActiveRole}>` : 'None'}`,
            ];

            rows.push(
                new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(generateModuleButtons(client, { pageId, pageOwner })),
                new ActionRowBuilder<ChannelSelectMenuBuilder>()
                    .addComponents(
                        client.Pages.generateSelectMenu({
                            customId: client.createCustomId({ 
                                customId: ChannelSM.customId, valueOne: pageId, valueTwo: "logChannel", ownerId: pageOwner.id 
                            }),
                            placeholder: "Log Channel",
                            channelTypes: [ChannelType.GuildText],
                            defaults: actConf?.logChannel ? [actConf.logChannel] : [],
                            type: "channel"
                        })
                    ),
                new ActionRowBuilder<RoleSelectMenuBuilder>()
                    .addComponents(
                        client.Pages.generateSelectMenu({
                            customId: client.createCustomId({ 
                                customId: RoleSM.customId, valueOne: pageId, valueTwo: "dailyActiveRole", ownerId: pageOwner.id 
                            }),
                            placeholder: "Daily Active Role",
                            defaults: actConf?.dailyActiveRole ? [actConf.dailyActiveRole] : [],
                            type: "role"
                        })
                    ),
                new ActionRowBuilder<RoleSelectMenuBuilder>()
                    .addComponents(
                        client.Pages.generateSelectMenu({
                            customId: client.createCustomId({ 
                                customId: RoleSM.customId, valueOne: pageId, valueTwo: "weeklyActiveRole", ownerId: pageOwner.id 
                            }),
                            placeholder: "Weekly Active Role",
                            defaults: actConf?.weeklyActiveRole ? [actConf.weeklyActiveRole] : [],
                            type: "role"
                        })
                    )
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
        defaults: [pageId],
        type: "string",
    })

    rows.push(
        new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(moduleSelectMenu)
    );

    return { embeds, rows };
}