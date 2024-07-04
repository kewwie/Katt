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
import { GuildGroupEntity } from "../../../entities/GuildGroup";
import { GroupMemberEntity } from "../../../entities/GroupMember";

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
            },
            {
                type: OptionTypes.BOOLEAN,
                name: "silent",
                description: "Silently verify the user",
                required: false
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
                !member.roles.cache.some(role => Object.values(roles).includes(role.id))
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
        const GuildGroupRepository = await dataSource.getRepository(GuildGroupEntity);
        const GroupMemberRepository = await dataSource.getRepository(GroupMemberEntity);

        let guildConfig = await GuildConfigRepository.findOne({ where: { guildId: interaction.guild.id } });

        let userId = interaction.options.getString("user");
        let member = await interaction.guild.members.fetch(userId);
        if (!member) {
            interaction.reply("User not found");
            return;
        }
        
        let silent = interaction.options.getBoolean("silent");

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

        if (!guildConfig.levelOne) {
            interaction.followUp({ content: "Level One role is not set in config", ephemeral: true })
            return;
        }

        var roles = new Array();
        roles.push(guildConfig.levelOne);
        
        var groups = await GroupMemberRepository.find({ where: { userId: member.id }});
        for (let group of groups) {
            let groupData = await GuildGroupRepository.findOne({ where: { groupId: group.groupId }});
            if (groupData) roles.push(groupData.roleId);
        }

        GuildUserRepository.insert({
            guildId: interaction.guild.id,
            userId: userId,
            userName: member.user.username,
            level: 1
        });

        UserVerifiedRepository.insert({
            guildId: interaction.guild.id,
            userId: userId,
            userName: member.user.username,
            modId: interaction.user.id,
            modName: interaction.user.username
        });

        let pendingMessage = await PendingMessageRepository.findOne({ where: { guildId: interaction.guild.id, userId: userId } });
        PendingMessageRepository.delete({ _id: pendingMessage?._id });
        let pendingChannel = await interaction.guild.channels.fetch(guildConfig.pendingChannel) as TextChannel;
        if (pendingChannel && pendingMessage?.messageId) {
            pendingChannel.messages.fetch(pendingMessage.messageId).then(message => { message.delete() }).catch(() => {});
        }

        var ApprovedEmbed = new EmbedBuilder()
            .setTitle("You've Been Approved")
            .setThumbnail(interaction.guild.iconURL())
            .addFields(
                { name: "Server ID", value: interaction.guild.id },
                { name: "Server Name", value: interaction.guild.name },
                { name: "Can't find it", value: `[Click Here](https://discord.com/channels/${interaction.guild.id})` }
            )
            .setFooter({ text: "Enjoy your stay!" })
            .setColor(0x90EE90);

        if (!silent) member.send({ embeds: [ApprovedEmbed] }).catch(() => {});
        member.roles.add(roles).catch(() => {});
        interaction.reply(`**${client.capitalize(member.user.username)}** has been verified`)

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