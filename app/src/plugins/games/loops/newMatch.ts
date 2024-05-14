import { EmbedBuilder } from '@discordjs/builders';

import { KiwiClient } from '../../../client';
import { Loop } from '../../../types/loop';

import { dataSource } from '../../../data/datasource';
import { ValorantUser } from '../../../data/entities/ValorantUser';

import { Regions } from "unofficial-valorant-api";

export const newMatchLoop: Loop = {
    name: "newMatch",
    seconds: 60 * 2.5,
    execute: async (client: KiwiClient) => {
        const valorantUserRepo = await dataSource.getRepository(ValorantUser);

        const valorantUsers = await valorantUserRepo.find();
        for (var valorantUser of valorantUsers) {
            var matchs: any = (await client.RiotApi.getMatchesByPUUID({ region: valorantUser.region as Regions, puuid: valorantUser.puuid })).data;
            if (!matchs) return;

            var match = matchs[0];
            
            if (match.metadata?.matchid !== valorantUser.last_match) {
                valorantUser.last_match = match.metadata.matchid;
                await valorantUserRepo.save(valorantUser);

                if (!valorantUser.send_report) break;

                var discordUser = await client.users.fetch(valorantUser.userId);

                if (!discordUser || match.metadata.mode_id !== "competitive") break;

                var player = match.players.all_players.find(p => p.puuid === valorantUser.puuid);

                var em = new EmbedBuilder()
                    .setAuthor({ name: discordUser.username, iconURL: discordUser.avatarURL() })
                    .setColor(0x2b2d31)
                    .setTitle("Match Report")
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

                discordUser.send({ embeds: [em] });
            }
        }

    }
}