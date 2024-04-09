import { CommandInteraction } from "discord.js";
import { KiwiClient } from "../client";
import { Events } from "../types/event";
import { env } from "../env";


module.exports = {
    name: Events.ready,
    once: true,

    /**
    * 
    * @param {KiwiClient} client
    * @param {CommandInteraction} interaction
    */
    async execute(client: KiwiClient) {
        console.log(`${client.user?.username} is Online`);

        for (let guild of client.guilds.cache.values()) {
            await client.commandHandler.unregister(guild.id);
        }
        //await client.commandHandler.unregister();

        if (env.TEST_GUILD) {
            await client.commandHandler.register(Array.from(client.commands.values()), env.TEST_GUILD);
        } else {
            await client.commandHandler.register(Array.from(client.commands.values()));
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