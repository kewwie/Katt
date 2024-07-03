import {
    AutocompleteInteraction,
	ChatInputCommandInteraction,
    EmbedBuilder,
    TextChannel
} from "discord.js";

import { KiwiClient } from "../../../client";

import { 
	CommandTypes,
	SlashCommandContexts,
	IntegrationTypes,
	OptionTypes,
	Permissions,
    SlashCommand
} from "../../../types/command";

import { dataSource } from "../../../datasource";
import { GuildConfigEntity } from "../../../entities/GuildConfig";
import { GuildUserEntity } from "../../../entities/GuildUser";
import { UserVerifiedEntity } from "../../../entities/UserVerified";
import { PendingMessageEntity } from "../../../entities/PendingMessage";

/**
 * @type {SlashCommand}
 */
export const VerifySlash: SlashCommand = {
	config: {
        name: "verify",
        description: "Verify a user",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: Permissions.ManageGuild,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                type: OptionTypes.STRING,
                name: "user",
                description: "The user to verify",
                autocomplete: true,
                required: true
            }
        ]
    },

     /**
     * @param {AutocompleteInteraction} interaction
     * @param {KiwiClient} client
     */
     async autocomplete(interaction: AutocompleteInteraction, client: KiwiClient) {
        const GuildConfigRepository = await dataSource.getRepository(GuildConfigEntity);
        var guildConfig = await GuildConfigRepository.findOne({ where: { guildId: interaction.guild.id } });
        let roles = {
            levelFive: guildConfig?.levelFive,
            levelFour: guildConfig?.levelFour,
            levelThree: guildConfig?.levelThree,
            levelTwo: guildConfig?.levelTwo,
            levelOne: guildConfig?.levelOne
        }

        let focusedValue = interaction.options.getFocused().toLowerCase();
        let choices = (await interaction.guild.members.fetch())
            .filter(
                member => !member.user.bot && 
                member.roles.cache.some(role => !Object.values(roles).includes(role.id))
            )

        let filtered = choices
            .filter(choice => choice.user.username.toLowerCase().startsWith(focusedValue) || choice.id.toLowerCase().startsWith(focusedValue))
            .reduce((unique, choice) => {
                const existingChoice = unique.find(c => c.userId === choice.id);
                if (!existingChoice) {
                    unique.push(choice);
                }
                return unique;
            }, [])
            .slice(0, 25);
            
		await interaction.respond(
			filtered.map(choice => ({ name: `${choice.user.username} (${choice.id})`, value: choice.id })),
		);
    },

	/**
    * 
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient) {
        const GuildConfigRepository = await dataSource.getRepository(GuildConfigEntity);
        const GuildUserRepository = await dataSource.getRepository(GuildUserEntity);
        const UserVerifiedRepository = await dataSource.getRepository(UserVerifiedEntity);
        const PendingMessageRepository = await dataSource.getRepository(PendingMessageEntity);

        let guildConfig = await GuildConfigRepository.findOne({ where: { guildId: interaction.guild.id } });

        let userId = interaction.options.getString("user");
        let member = await interaction.guild.members.fetch(userId);

        let self = await GuildUserRepository.findOne({ where: { guildId: interaction.guild.id, userId: interaction.user.id } });
        if (self?.level < 2) {
            interaction.reply("You do not have permission to verify users");
            return;
        }

        let isUser = await GuildUserRepository.findOne({ where: { guildId: interaction.guild.id, userId: userId } });
        if (isUser) {
            interaction.reply("User is already verified");
            return;
        }

        GuildUserRepository.insert({
            guildId: interaction.guild.id,
            userId: userId,
            level: 1
        });

        UserVerifiedRepository.insert({
            guildId: interaction.guild.id,
            userId: userId,
            userName: member.user.username,
            modId: interaction.user.id,
            modName: interaction.user.username
        });

        PendingMessageRepository.delete({ guildId: interaction.guild.id, userId: userId });

        var ApprovedEmbed = new EmbedBuilder()
            .setTitle("You've Been Approved")
            .setThumbnail(interaction.guild.iconURL())
            .addFields(
                { name: "Server ID", value: interaction.guild.id },
                { name: "Server Name", value: interaction.guild.name }
            )
            .setFooter({ text: "Enjoy your stay!" })
            .setColor(0x90EE90);

        member.send({ embeds: [ApprovedEmbed] }).catch(() => {});
        member.roles.add(guildConfig.levelOne).catch(() => {});

        if (guildConfig.logChannel) {
            var log = await interaction.guild.channels.fetch(guildConfig.logChannel) as TextChannel;
            if (!log) return;

            var LogEmbed = new EmbedBuilder()
                .setTitle("Approved User")
                .setThumbnail(member.user.avatarURL())
                .setColor(0x90EE90)
                .addFields(
                    { name: "User", value: `<@${member.user.id}>\n${member.user.username}` },
                    { name: "Approved By", value: `<@${interaction.member.user.id}>\n${interaction.member.user.username}` }
                )

            await log.send({
                embeds: [LogEmbed]
            });
        }
	}
}