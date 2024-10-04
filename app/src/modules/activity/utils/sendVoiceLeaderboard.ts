import { EmbedBuilder, TextChannel } from "discord.js";
import { KiwiClient } from "../../../client";

export const sendVoiceLeaderboard = async (
    client: KiwiClient,
    guildId: string,
    channelId: string,
    type: string
) => {

    const lb = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
    });

    var leaderboard = [];

    switch (type) {
        case "daily":
            var users = await client.db.repos.activityVoice.find({
                order: {
                    dailySeconds: "DESC"
                },
                take: 10
            });
            leaderboard.push("## Daily Voice Leaderboard");
            break;

        case "weekly":
            var users = await client.db.repos.activityVoice.find({
                order: {
                    weeklySeconds: "DESC"
                },
                take: 10
            });
            leaderboard.push("## Weekly Voice Leaderboard");
            break;

        case "monthly":
            var users = await client.db.repos.activityVoice.find({
                order: {
                    monthlySeconds: "DESC"
                },
                take: 10
            });
            leaderboard.push("## Monthly Voice Leaderboard");
            break;

        case "total":
            var users = await client.db.repos.activityVoice.find({
                order: {
                    totalSeconds: "DESC"
                },
                take: 10
            });
            leaderboard.push("## Voice Leaderboard");
            break;
    }

    var leaderboardUsers = users.map((user, i) => {
        return `${i + 1}. **${client.capitalize(user.userName)}** - ${lb.format(user[type + "Seconds"] / (60 * 60))} hours`;
    }); 
    leaderboard.push(leaderboardUsers.join("\n"));

    var channel = await client.channels.fetch(channelId) as TextChannel;
    if (!channel) return;
    channel.send(leaderboard.join("\n")).catch();
}
