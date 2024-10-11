import { KiwiClient } from "../../../client";

export const createMessageLeaderboard = async (
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
            var users = await client.db.repos.activityMessages.find({
                where: {
                    guildId: guildId
                },
                order: {
                    dailyMessages: "DESC"
                },
                take: 10
            });
            users = users.filter(user => user.dailyMessages > 0);
            leaderboard.push("## Daily Message Leaderboard");
            break;

        case "weekly":
            var users = await client.db.repos.activityMessages.find({
                where: {
                    guildId: guildId
                },
                order: {
                    weeklyMessages: "DESC"
                },
                take: 10
            });
            users = users.filter(user => user.weeklyMessages > 0);
            leaderboard.push("## Weekly Message Leaderboard");
            break;

        case "monthly":
            var users = await client.db.repos.activityMessages.find({
                where: {
                    guildId: guildId
                },
                order: {
                    monthlyMessages: "DESC"
                },
                take: 10
            });
            users = users.filter(user => user.monthlyMessages > 0);
            leaderboard.push("## Monthly Message Leaderboard");
            break;

        case "total":
            var users = await client.db.repos.activityMessages.find({
                where: {
                    guildId: guildId
                },
                order: {
                    totalMessages: "DESC"
                },
                take: 10
            });
            users = users.filter(user => user.totalMessages > 0);
            leaderboard.push("## Message Leaderboard");
            break;
    }
    
    if (!users || users.length === 0) {
        leaderboard.push("No users found.");
    } else {
        var leaderboardUsers = users.map((user, i) => {
            return `${i + 1}. **${client.capitalize(user.userName)}** - ${lb.format(user[type + "Messages"] / (60 * 60))} messages`;
        }); 
        leaderboard.push(leaderboardUsers.join("\n"));
    }

    return { content: leaderboard.join("\n") };
}
