import {
	ChatInputCommandInteraction,
    EmbedBuilder,
    AttachmentBuilder
} from "discord.js";
import { writeFileSync } from 'fs';

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

import { Regions } from "unofficial-valorant-api";

export const ValorantCmd: Command = {
	config: {
        name: "valorant",
        description: "VALORANT Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: null,
        contexts: [SlashCommandContexts.GUILD, SlashCommandContexts.PRIVATE_CHANNEL],
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
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "send-report",
                description: "send a report of your match to your DMs",
                options: [
                    {
                        type: OptionTypes.BOOLEAN,
                        name: "active",
                        description: "True or False if you want to send a report of your match to your DMs",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "get-crosshair",
                description: "Get your last matches",
                options: [
                    {
                        type: OptionTypes.STRING,
                        name: "code",
                        description: "The crosshair code you want to get the image of",
                        required: true
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

                var valorantUser: any = await client.RiotApi.getAccount({ name: name, tag: tag });
                if (valorantUser.status !== 200) {
                    interaction.reply("Something went wrong");
                    return;
                }

                if (!valorantUser.data.puuid) {
                    interaction.reply("User not found");
                    return;
                }

                var existingUser = await ValorantUserReposatory.findOne(
                    { where: { puuid: valorantUser.data["puuid"] } }
                );

                if (existingUser && existingUser.userId !== interaction.user.id) {
                    interaction.reply("Another user has already saved this account");
                    return;
                }

                var match: any = (await client.RiotApi.getMatchesByPUUID({ region: valorantUser.data.region, puuid: valorantUser.data.puuid})).data[0];
    
                if (match.metadata.matchid) {
                    match = match.metadata.matchid;
                } else{
                    match = null;
                }

                await ValorantUserReposatory.upsert(
                    { 
                        userId: interaction.user.id,
                        puuid: valorantUser.data.puuid,
                        name: valorantUser.data.name,
                        tag: valorantUser.data.tag,
                        region: valorantUser.data.region,
                        last_match: match
                    },
                    ["userId"]
                );

                interaction.reply(`Set **${interaction.user.username}**'s username to **${valorantUser.data.name}#${valorantUser.data.tag}**`)
                break;
            }
            case "rank": {
                var user = interaction.options.getUser("user") || interaction.user;
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

                var valorantUser: any = await client.RiotApi.getAccountByPUUID({ puuid: valUser.puuid });
                if (valorantUser.status !== 200) {
                    interaction.reply("Something went wrong");
                    return;
                }

                var rank: any = await client.RiotApi.getMMRByPUUID({ region: valorantUser.data.region, puuid: valorantUser.data.puuid, version: "v2" });

                if (rank.status !== 200) {
                    interaction.reply("Something went wrong");
                    return;
                }


                const em = new EmbedBuilder()
                    .setColor(client.embed.color)
                    .setAuthor({ name: `${user.username.charAt(0).toUpperCase() + user.username.slice(1)}`, iconURL: await client.getAvatarUrl({ id: user.id, avatar: user.avatar }) })
                    .setThumbnail(valorantUser.data.card.small)
                    .addFields(
                        { name: 'Current Rank', value: `**${rank.data.current_data.currenttierpatched}** \n${rank.data.current_data.ranking_in_tier}rr` },
                        { name: 'Peak Rank', value: `**${rank.data.highest_rank.patched_tier}**` },
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

                var match: any = (await client.RiotApi.getMatchesByPUUID({ region: valUser.region as Regions, puuid: valUser.puuid })).data[0];

                var player = match.players.all_players.find(p => p.puuid === valUser.puuid);

                const em = new EmbedBuilder()
                    .setColor(client.embed.color)
                    .setAuthor({ name: `${user.username.charAt(0).toUpperCase() + user.username.slice(1)}`, iconURL: await client.getAvatarUrl({ id: user.id, avatar: user.avatar }) })
                    .setThumbnail(player.assets.card.small)
                    .addFields(
                        { name: 'Server', value: match.metadata.cluster, inline: true },
                        { name: 'Map', value: match.metadata.map, inline: true },
                        { name: 'Mode', value: match.metadata.mode, inline: true },
                        { name: 'Rounds', value: `${match.metadata.rounds_played}` },
                        { name: "Agent", value:  player.character },
                        { name: "Kills", value: `${player.stats.kills}`, inline: true },
                        { name: "Deaths", value: `${player.stats.deaths}`, inline: true },
                        { name: "Assists", value: `${player.stats.assists}`, inline: true },
                        { name: "K/D", value: `${(player.stats.kills / player.stats.deaths).toFixed(2)}` },
                        { name: "Headshot%", value: `${((player.stats.headshots / (player.stats.bodyshots + player.stats.headshots + player.stats.legshots)) * 100).toFixed(1)}%` },
                        { name: "Damage Made", value: `${player.damage_made}` },
                        { name: "Damage Taken", value: `${player.damage_received}` },
                    )
                    .setFooter({ text: `Match ID: ${match.metadata.matchid}` })
                    .setTimestamp();

                await interaction.reply({ embeds: [em] });
                break;
            }
            case "send-report": {
                var active = interaction.options.getBoolean("active");
                if (active === null) {
                    interaction.reply({ content: "Please provide a boolean", ephemeral: true });
                    return;
                }

                var valUser = await ValorantUserReposatory.findOne(
                    { where: { userId: interaction.user.id } }
                );

                if (!valUser) {
                    interaction.reply({ content:"You haven't saved your VALORANT username", ephemeral: true });
                    return;
                }

                valUser.send_report = active;
                await ValorantUserReposatory.save(valUser);

                interaction.reply({ content: `Set **${interaction.user.username}**'s send report to **${active}**`, ephemeral: true });
                break;
            }
            case "get-crosshair": {
                await interaction.reply("This command is currently disabled");
                return;
                /*var code = interaction.options.getString("code");
                if (!code) {
                    interaction.reply("Please provide a code");
                    return;
                }

                var crosshair_data = await client.RiotApi.getCrosshair({code: code});
                if (crosshair_data.status === 400) {
                    interaction.reply(crosshair_data.message);
                    return;
                }
                
                console.log(crosshair_data, 1011, Buffer.from(crosshair_data))
    
                //download('0;P;c;5;t;3;o;1;f;0;m;1;0t;4;0l;5;0o;0;0a;1;0f;0;1t;8;1l;3;1o;0;1a;1;1m;0;1f;0');

                const em = new EmbedBuilder()
                    .setColor(client.embed.color)
                    .setTitle("Crosshair")
                    //.setImage(writeFileSync())
                    .setTimestamp();


                // https://github.com/Henrik-3/unofficial-valorant-api/blob/main/package/examples/download_crosshair.js
                const attach = new AttachmentBuilder(Buffer.from(crosshair_data), { name: 'result.jpeg' })

                //interaction.reply({ files: [attach] });
                break;*/
            }
        }
    }
}