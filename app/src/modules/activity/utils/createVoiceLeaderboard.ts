import { EmbedBuilder, TextChannel } from "discord.js";
import { KiwiClient } from "../../../client";

export const createVoiceLeaderboard = async (
    client: KiwiClient,
    guildId: string,
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
                where: {
                    guildId: guildId
                },
                order: {
                    dailySeconds: "DESC"
                },
                take: 10
            });
            users = users.filter(user => user.dailySeconds > 0);
            leaderboard.push("## Daily Voice Leaderboard");
            break;

        case "weekly":
            var users = await client.db.repos.activityVoice.find({
                where: {
                    guildId: guildId
                },
                order: {
                    weeklySeconds: "DESC"
                },
                take: 10
            });
            users = users.filter(user => user.weeklySeconds > 0);
            leaderboard.push("## Weekly Voice Leaderboard");
            break;

        case "monthly":
            var users = await client.db.repos.activityVoice.find({
                where: {
                    guildId: guildId
                },
                order: {
                    monthlySeconds: "DESC"
                },
                take: 10
            });
            users = users.filter(user => user.monthlySeconds > 0);
            leaderboard.push("## Monthly Voice Leaderboard");
            break;

        case "total":
            var users = await client.db.repos.activityVoice.find({
                where: {
                    guildId: guildId
                },
                order: {
                    totalSeconds: "DESC"
                },
                take: 10
            });
            users = users.filter(user => user.totalSeconds > 0);
            leaderboard.push("## Voice Leaderboard");
            break;
    }
    
    if (!users || users.length === 0) {
        leaderboard.push("No users found.");
    } else {
        var leaderboardUsers = users.map((user, i) => {
            return `${i + 1}. **${client.capitalize(user.userName)}** - ${lb.format(user[type + "Seconds"] / (60 * 60))} hours`;
        }); 
        leaderboard.push(leaderboardUsers.join("\n"));
    }

    return { content: leaderboard.join("\n") };
}
