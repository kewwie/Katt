import {
    CommandInteraction
} from "discord.js";

import { 
    CommandTypes,
    SlashCommandContexts,
    IntegrationTypes,
    OptionTypes,
    Permissions,
    Command
} from "../../../types/command";
import { KiwiClient } from "../../../client";

export const Whitelist: Command = {
    config: {
        name: "whitelist",
        description: "Whitelist Commands",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: Permissions.ManageGuild,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.SUB_COMMAND,
                name: "add",
                description: "Add a user to the whitelist",
                options: [
                    {
                        type: OptionTypes.USER,
                        name: "user",
                        description: "The user to whitelist",
                        required: true
                    },
                    {
                        type: OptionTypes.STRING,
                        name: "level",
                        description: "The level of the whitelist",
                        required: true,
                        choices: [
                            { name: "Guest", value: "guest" },
                            { name: "Member", value: "member" }
                        ]
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "remove",
                description: "Remove a user from the whitelist",
                options: [
                    {
                        type: OptionTypes.USER,
                        name: "user",
                        description: "The user to remove from the whitelist",
                        required: true
                    }
                ]
            },
            {
                type: OptionTypes.SUB_COMMAND,
                name: "view",
                description: "View the whitelist",
            }
        ]
    },

    /**
    * @param {CommandInteraction} interaction
    * @param {KiwiClient} client
    */
    async execute(interaction: CommandInteraction, client: KiwiClient) {
        interaction.reply("Whitelist Command")
    }
}