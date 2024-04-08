const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { env } = require("../env");

const guildId = ent.TEST_GUILD; // Guild ID

async function unregisterAll() {
    const rest = new REST({ version: '10' }).setToken(env.CLIENT_TOKEN);

    if (guildId) {
        let data = await rest.get(
            Routes.applicationGuildCommands(env.CLIENT_ID, guildId)
        )

        for (let command of data) {
            await rest.delete(
                Routes.applicationGuildCommand(env.CLIENT_ID, guildId, command.id)
            )
        }
        console.log(`Successfully unregistered ${data.length} guild (/) commands.`);
    } else {
        let data = await rest.get(
            Routes.applicationCommands(env.CLIENT_ID)
        )

        for (let command of data) {
            await rest.delete(
                Routes.applicationCommand(env.CLIENT_ID, command.id)
            )
        }
        console.log(`Successfully unregistered ${data.length} (/) commands.`);
    }
}

unregisterAll();