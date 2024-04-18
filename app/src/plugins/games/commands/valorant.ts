import {
	ChatInputCommandInteraction,
    EmbedBuilder
} from "discord.js";

import { KiwiClient } from "../../../client";

import { 
	CommandTypes,
	SlashCommandContexts,
	IntegrationTypes,
	OptionTypes,
    Command
} from "../../../types/command"
import { dataSource } from "../../../data/datasource";
import { ValorantUser } from "../../../data/entities/ValorantUser";

export const ValorantCmd: Command = {
	config: {
        name: "valorant",
        description: "VALORANT Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: null,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD, IntegrationTypes.USER],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "set",
                description: "Set your VALORANT username",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "name",
                        description: "Your VALORANT username",
                        required: true
                    },
                    {
                        type: OptionTypes.STRING,
                        name: "tag",
                        description: "Your VALORANT tag",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "rank",
                description: "Get your or a users rank",
                options: [
                    {
                        type: OptionTypes.USER,
                        name: "user",
                        description: "The user you want to check the rank of",
                        required: false
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "last-match",
                description: "Get your last match",
                options: [
                    {
                        type: OptionTypes.USER,
                        name: "user",
                        description: "The user you want to check the last match of",
                    }
                ]
            }
        ]
    },

    /**
    * 
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        const ValorantUserReposatory = await dataSource.getRepository(ValorantUser);

        switch (interaction.options.getSubcommand()) {
            case "set": {
                var name = interaction.options.getString("name");
                var tag = interaction.options.getString("tag");

                if (!name || !tag) {
                    interaction.reply("Please provide a name and tag");
                    return;
                }

                var valorantUser = await client.RiotApi.getAccount({ name, tag });

                var existingUser = await ValorantUserReposatory.findOne(
                    { where: { puuid: valorantUser.puuid } }
                );

                if (existingUser && existingUser.userId !== interaction.user.id) {
                    interaction.reply("Another user has already saved this account");
                    return;
                }

                await ValorantUserReposatory.upsert(
                    { 
                        userId: interaction.user.id,
                        puuid: valorantUser.puuid,
                        name: valorantUser.name,
                        tag: valorantUser.tag,
                        region: valorantUser.region
                    },
                    ["userId"]
                );

                interaction.reply(`Set **${interaction.user.username}**'s username to **${valorantUser.name}#${valorantUser.tag}**`)
                break;
            }
            case "rank": {
                var user = interaction.options.getUser("name") || interaction.user;
                if (!user) {
                    interaction.reply("User not found");
                    return;
                }

                var valUser = await ValorantUserReposatory.findOne(
                    { where: { userId: user.id } }
                );

                if (!valUser) {
                    interaction.reply("This user havent saved their VALORANT username");
                    return;
                }

                var rank = await client.RiotApi.getMMRByPUUID({ region: valUser.region, puuid: valUser.puuid });

                if (rank.status === 400) {
                    interaction.reply(rank.message);
                    return;
                }

                if (
                    rank.name !== valUser.name || rank.tag !== valUser.tag
                ) {
                    await ValorantUserReposatory.update(
                        { userId: user.id },
                        { 
                            name: rank.name,
                            tag: rank.tag,
                            region: rank.region
                        }
                    );
                }

                const em = new EmbedBuilder()
                    .setColor(client.embed.color)
                    .setTitle(`${user.username.charAt(0).toUpperCase() + user.username.slice(1)}'s Rank`)
                    .setThumbnail(await client.getAvatarUrl(user))
                    .addFields(
                        { name: 'Current Rank', value: `**${rank.current_data.currenttierpatched}** \n${rank.current_data.ranking_in_tier}%` },
                        { name: 'Peak Rank', value: `**${rank.highest_rank.patched_tier}**` },
                    )
                    .setTimestamp();

                interaction.reply({ embeds: [em] });
                break;
            }
            case "last-match": {
                var user = interaction.options.getUser("user") || interaction.user;
                if (!user) {
                    interaction.reply("User not found");
                    return;
                }

                var valUser = await ValorantUserReposatory.findOne(
                    { where: { userId: user.id } }
                );

                if (!valUser) {
                    interaction.reply("This user hasn't saved their VALORANT username");
                    return;
                }

                var [match] = await client.RiotApi.getMatchesByPUUID({ region: valUser.region, puuid: valUser.puuid, limit: 1 });
        
                if (match.status === 400) {
                    interaction.reply(match.message);
                    return;
                }

                var account = await client.RiotApi.getAccountByPUUID({ puuid: valUser.puuid });

                if (
                    account.name !== valUser.name || account.tag !== valUser.tag
                ) {
                    await ValorantUserReposatory.update(
                        { userId: user.id },
                        { 
                            name: account.name,
                            tag: account.tag,
                            region: account.region
                        }
                    );
                }

                const em = new EmbedBuilder()
                    .setColor(client.embed.color)
                    .setTitle(`${user.username.charAt(0).toUpperCase() + user.username.slice(1)}'s Last Match`)
                    .setThumbnail(await client.getAvatarUrl(user))
                    .addFields(
                        { name: 'Map', value: match.metadata.map },
                        { name: 'Mode', value: match.metadata.mode },
                        { name: 'Rounds', value: match.metadata.rounds_played },
                    )
                    .setTimestamp();

                await interaction.reply({ embeds: [em] });
                break;
            }
        }
    }
}