import {
	CommandInteraction,
    EmbedBuilder
} from "discord.js";

import { KiwiClient } from "../client";

import { 
	CommandTypes,
	SlashCommandContexts,
	IntegrationTypes,
	OptionTypes
} from "../types/command";

module.exports = {
	config: {
        name: "valorant",
        description: "VALORANT Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: null,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
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
    * @param {CommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: any, client: KiwiClient) {
        switch (interaction.options.getSubcommand()) {
            case "set": {
                var name = interaction.options.getString("name");
                var tag = interaction.options.getString("tag");

                if (!name || !tag) return interaction.reply("Please provide a name and tag");

                var user = await client.riotApi.getAccount({ name, tag });

                var existingUser = await client.database.db("kiwi").collection("valorantUsers").findOne(
                    { puuid: user.puuid }
                );

                if (existingUser && existingUser.userId !== interaction.user.id) {
                    return interaction.reply("Another user has already saved this account");
                }

                await client.database.db("kiwi").collection("valorantUsers").updateOne(
                    { userId: interaction.user.id },
                    { $set: { 
                        puuid: user.puuid,
                        region: user.region,
                        name: user.name,
                        tag: user.tag
                    } },
                    { upsert: true }
                );

                interaction.reply(`Set **${interaction.user.username}**'s username to **${user.name}#${user.tag}**`)
                break;
            }
            case "rank": {
                var user = interaction.options.getUser("name") || interaction.user;
                if (!user) return interaction.reply("User not found");

                var valUser = await client.database.db("kiwi").collection("valorantUsers").findOne(
                    { userId: user.id }
                );

                if (!valUser) return interaction.reply("This user havent saved their VALORANT username");

                var rank = await client.riotApi.getMMRByPUUID({ region: valUser.region, puuid: valUser.puuid });
                console.log(rank)

                if (rank.status === 400) return interaction.reply(rank.message);

                if (
                    rank.name !== valUser.name || rank.tag !== valUser.tag
                ) {
                    client.database.db("kiwi").collection("valorantUsers").updateOne(
                        { userId: user.id },
                        { $set: { 
                            name: rank.name,
                            tag: rank.tag
                        } }
                    );
                }

                const em = new EmbedBuilder()
                    .setColor(client.embed.color)
                    .setTitle(`${user.username.charAt(0).toUpperCase() + user.username.slice(1)}'s Rank`)
                    .setThumbnail(client.getAvatarUrl(user))
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
                if (!user) return interaction.reply("User not found");

                var valUser = await client.database.db("kiwi").collection("valorantUsers").findOne(
                    { userId: user.id }
                );

                if (!valUser) return interaction.reply("This user hasn't saved their VALORANT username");

                var [match] = await client.riotApi.getMatchesByPUUID({ region: valUser.region, puuid: valUser.puuid, limit: 1 });
        
                if (match.status === 400) return interaction.reply(match.message);

                var account = await client.riotApi.getAccountByPUUID({ puuid: valUser.puuid });

                if (
                    account.name !== valUser.name || account.tag !== valUser.tag
                ) {
                    client.database.db("kiwi").collection("valorantUsers").updateOne(
                        { userId: user.id },
                        { $set: { 
                            name: account.name,
                            tag: account.tag
                        } }
                    );
                }
                console.log(match)

                const em = new EmbedBuilder()
                    .setColor(client.embed.color)
                    .setTitle(`${user.username.charAt(0).toUpperCase() + user.username.slice(1)}'s Last Match`)
                    .setThumbnail(client.getAvatarUrl(user))
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