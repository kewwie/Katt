import { Client } from "discord.js";

export default {
    async execute(client: Client) {
        console.log(`${client.user?.username} is Online`)
    }
}