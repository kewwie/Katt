import { EmbedBuilder, TextChannel } from "discord.js";
import { KiwiClient } from "../../../client";

export const sendVoiceLeaderboard = async (
    client: KiwiClient,
    guildId: string,
    channelId: string,
    type: string
) => {
    var em = new EmbedBuilder()
        .setColor(client.Settings.color)
        .setTimestamp(new Date());

    switch (type) {
        case "daily":
            var users = await client.db.repos.activityVoice.find({
                order: {
                    dailySeconds: "DESC"
                },
                take: 10
            });
            em.setTitle("Daily Voice Activity Leaderboard");
            break;

        case "weekly":
            var users = await client.db.repos.activityVoice.find({
                order: {
                    weeklySeconds: "DESC"
                },
                take: 10
            });
            em.setTitle("Weekly Voice Activity Leaderboard");
            break;

        case "monthly":
            var users = await client.db.repos.activityVoice.find({
                order: {
                    monthlySeconds: "DESC"
                },
                take: 10
            });
            em.setTitle("Monthly Voice Activity Leaderboard");
            break;

        case "total":
            var users = await client.db.repos.activityVoice.find({
                order: {
                    totalSeconds: "DESC"
                },
                take: 10
            });
            em.setTitle("Voice Activity Leaderboard");
            break;
    }
    var typeName = type.charAt(0).toUpperCase() + type.slice(1);

    var embedDescription = [];
    for (var user of users) {
        embedDescription.push(
            `**${user.userName}** - ${Math.round(user[type.toLowerCase() + "Seconds"] / 60 / 60)} hours`
        );        
    }

    em.setDescription(embedDescription.join("\n"));

    var channel = await client.channels.fetch(channelId) as TextChannel;
    if (!channel) return;
    channel.send({ embeds: [em]}).catch();
}
