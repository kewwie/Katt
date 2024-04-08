const {
	Client,
    VoiceState
} = require("discord.js");

module.exports = {
    name: "voiceStateUpdate", // VoiceServerUpdate

    /**
    * @param {Client} client
    * @param {VoiceState} oldVoiceState
    * @param {VoiceState} newVoiceState
    */
    async execute(client, oldVoiceState, newVoiceState) {
        console.log("Voice State Update");
        const previousVoice = await client.database.db("kiwi").collection("voiceChannels").findOne(
            { userId: oldVoiceState.id, guildId: oldVoiceState.guild.id }
        );
        if (previousVoice && !newVoiceState.channelId) {
            const minutesSinceLastUpdate = (Date.now() - previousVoice.joinTime) / (1000 * 60);
            
            await client.database.db("kiwi").collection("minutes").updateOne(
                { userId: oldVoiceState.id, guildId: oldVoiceState.guild.id },
                { $inc: { minutes: minutesSinceLastUpdate } },
                { upsert: true }
            );

            await client.database.db("kiwi").collection("voiceChannels").deleteOne(
                { userId: oldVoiceState.id, guildId: oldVoiceState.guild.id }
            );   
        } else if (!oldVoiceState.channelId && newVoiceState.channelId) {
            await client.database.db("kiwi").collection("voiceChannels").updateOne(
                { userId: oldVoiceState.id, guildId: oldVoiceState.guild.id },
                { $set: { joinTime: Date.now() } },
                { upsert: true }
            );
        };
    }
}