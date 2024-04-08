const {
    CommandInteraction,
    Client,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: {
        id: "accept-user",
    },
    /**
    * 
    * @param {CommandInteraction} interaction
    * @param {Client} client
    */
    async execute(interaction, client) {
        interaction.deferUpdate();
        var type = interaction.customId.split("_")[1];
        var memberId = interaction.customId.split("_")[2];
        
        var member = await interaction.guild.members.fetch(memberId);
       
        try {
            const guild = await client.database.db("kiwi").collection("guilds").findOne(
                { guildId: interaction.guildId }
            );
            if (guild && type) {
                
                if (type === "guest") {
                    var role = await interaction.guild.roles.cache.find(role => role.id === guild.guestRole);
                    if (role) {
                        await member.roles.add(role);
                    }
                }
                if (type === "member") {
                    var role = await interaction.guild.roles.cache.find(role => role.id === guild.memberRole);
                    if (role) {
                        await member.roles.add(role);
                    }
                }

                const groups = await client.database.db("kiwi").collection("groups").find({ guildId: interaction.guildId, members: { $in: [memberId] } }).toArray();
                for (const group of groups) {
                    const role = await interaction.guild.roles.cache.find(role => role.id === group.roleId);
                    if (role) {
                        await member.roles.add(role);
                    }
                }

                await member.send(`You have been **verified** in **${interaction.guild.name}**`);
                await interaction.message.delete();
        
                if (guild.logsChannel) {
                    var log = await interaction.guild.channels.cache.get(guild.logsChannel);

                    var addedRoles = member.roles.cache
                        .filter((roles) => roles.id !== interaction.guildId)
                        .sort((a, b) => b.rawPosition - a.rawPosition)
                        .map((role) => role.name);

                    var em = new EmbedBuilder()
                        .setTitle(member.user.username + "#" + member.user.discriminator)
                        .setThumbnail(member.user.avatarURL())
                        .addFields(
                            { name: "Mention", value: `<@${member.user.id}>` },
                            { name: "Verified By", value: `<@${interaction.member.id}>` },
                            { name: "Roles", value: addedRoles.join(", ")}
                        )
                        .setColor(0x90EE90)

                    await log.send({
                        embeds: [em]
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
}