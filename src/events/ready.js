const { Client, CommandInteraction } = require("discord.js");
const { env } = require("../env");

module.exports = {
    name: "ready",
    once: true,

    /**
    * 
    * @param {Client} client
    * @param {CommandInteraction} interaction
    */
    async execute(client) {
        console.log(`${client.user?.username} is Online`);

        for (let guild of client.guilds.cache.values()) {
            client.commandHandler.unregister(guild.id);
        }

        if (env.TEST_GUILD) {
            client.commandHandler.register(client.commands.values(), env.TEST_GUILD);
        } else {
            client.commandHandler.register(client.commands.values());
        }

        for (var guild of client.guilds.cache.values()) {
            for (var voiceState of guild.voiceStates.cache.values()) {

                const vs = await client.database.db("kiwi").collection("voiceChannels").findOne(
                    { userId: voiceState.id, guildId: voiceState.guild.id }
                );

                if (vs && vs.joinTime) {
                    let newMinutes = (Date.now() - vs.joinTime) / (1000 * 60);

                    await client.database.db("kiwi").collection("voiceActivity").updateOne(
                        { userId: voiceState.id, guildId: voiceState.guild.id },
                        { $inc: { minutes: newMinutes } },
                    );
                }

                if (voiceState && voiceState.channelId) {
                    if (!vs) {
                        await client.database.db("kiwi").collection("voiceChannels").updateOne(
                            { userId: voiceState.id, guildId: voiceState.guild.id },
                            { $set: { joinTime: Date.now() } },
                            { upsert: true }
                        );
                    }
                } else {
                    client.database.db("kiwi").collection("voiceChannels").deleteOne(
                        { userId: voiceState.id, guildId: voiceState.guild.id }
                    );
                }
            }
        }
    }
}