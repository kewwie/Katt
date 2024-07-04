import {
    ActionRowBuilder,
    AutocompleteInteraction,
	ButtonBuilder,
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
    SlashCommand,
    Permissions
} from "../../../types/command";

import { dataSource } from "../../../datasource";
import { GuildUserEntity } from "../../../entities/GuildUser";
import { GuildConfigEntity } from "../../../entities/GuildConfig";

import { KickUser } from "../buttons/kick-user";
import { CancelKick } from "../buttons/cancel-kick";

import { GetHighestRole } from "../functions/getHighestRole";

/**
 * @type {SlashCommand}
 */
export const DemoteSlash: SlashCommand = {
	config: {
        name: "demote",
        description: "Demote a user to a lower level",
        type: CommandTypes.CHAT_INPUT,
        default_member_permissions: Permissions.ManageGuild,
        contexts: [SlashCommandContexts.GUILD],
        integration_types: [IntegrationTypes.GUILD],
        options: [
            {
                name: "user",
                description: "The user you want to promote",
                type: OptionTypes.STRING,
                autocomplete: true,
                required: true,
            }
        ]
    },

    /**
    * @param {AutocompleteInteraction} interaction
    * @param {KiwiClient} client
    */
    async autocomplete(interaction: AutocompleteInteraction, client: KiwiClient) {
        const GuildUserRepository = await dataSource.getRepository(GuildUserEntity);
        let self = await GuildUserRepository.findOne({ where: { guildId: interaction.guild.id, userId: interaction.user.id } });

        let choices = (await GuildUserRepository.find({ where: { guildId: interaction.guild.id } }))
            .filter(choice => choice.level <= 4 && choice.level <= self.level - 1);
        let focusedValue = interaction.options.getFocused().toLowerCase();
        let filtered = choices.filter(choice => choice.userName.toLowerCase().startsWith(focusedValue) || choice.userId.toLowerCase().startsWith(focusedValue));
        await interaction.respond(
			filtered.map(choice => ({ name: `${choice.userName} (${choice.userId}) - Level ${choice.level}`, value: choice.userId })),
		);
    },

	/**
    * @param {ChatInputCommandInteraction} interaction
    * @param {KiwiClient} client
    */
	async execute(interaction: ChatInputCommandInteraction, client: KiwiClient): Promise<void> {
        const GuildUserRepository = await dataSource.getRepository(GuildUserEntity);
        const GuildConfigRepository = await dataSource.getRepository(GuildConfigEntity);
        let guildConfig = await GuildConfigRepository.findOne({ where: { guildId: interaction.guild.id } });
        
        var userId = interaction.options.getString("user");

        if (userId === interaction.user.id) {
            interaction.reply("You cannot demote yourself");
            return;
        }

        var self = await GuildUserRepository.findOne({ where: { guildId: interaction.guild.id, userId: interaction.user.id } });
        var user = await GuildUserRepository.findOne({ where: { guildId: interaction.guild.id, userId: userId } });

        if (!self) {
            interaction.reply("You are not in the database");
            return;
        }

        if (!user) {
            interaction.reply("User not found");
            return;
        }

        if (self.level <= user.level) {
            interaction.reply("You cannot demote someone thats a higher level than yourself");
            return;
        }

        if (user.level == 5) {
            interaction.reply(`**${client.capitalize(user.userName)}** is the owner of the server and cannot be demoted`);
            return;
        }

        var member = await interaction.guild.members.fetch(userId);
        if ((user.level - 1) <= 0 && member) {
            var rows = new Array();
            rows.push(new ActionRowBuilder()
                .addComponents([
                    new ButtonBuilder(KickUser.config)
                        .setCustomId("kick-user_" + user.userId + "_" + interaction.user.id),
                ])
                .addComponents([
                    new ButtonBuilder(CancelKick.config)
                        .setCustomId("cancel-kick_" + user.userId + "_" + interaction.user.id),
                ])
            );
            interaction.reply({ content: `Are you sure you want to demote **${client.capitalize(user.userName)}** and kick them?`, components: rows });
        } else {
            GuildUserRepository.update({ guildId: interaction.guild.id, userId: userId }, { level: user.level - 1 });
            interaction.reply(`**${client.capitalize(user.userName)}** demoted to level **${user.level - 1}**`);

            if (member) {
                var roles = {
                    1: guildConfig.levelOne,
                    2: guildConfig.levelTwo,
                    3: guildConfig.levelThree,
                    4: guildConfig.levelFour,
                    5: guildConfig.levelFive
                };
                
                var highestRole = await GetHighestRole(user.level - 1, roles);
                member.roles.add(highestRole).catch(() => {});
                for (let roleId of Object.values(roles)) {
                    if (roleId !== highestRole && member.roles.cache.has(roleId)) {
                        member.roles.remove(roleId).catch(() => {});
                    }
                }
            }

            if (guildConfig.logChannel) {
                var log = await interaction.guild.channels.fetch(guildConfig.logChannel) as TextChannel;
                if (!log) return;
    
                let u = await interaction.client.users.fetch(userId);
                if (!u) return;
    
                var LogEmbed = new EmbedBuilder()
                    .setTitle("Demoted User")
                    .setThumbnail(u.avatarURL())
                    .setColor(0xFF474D)
                    .addFields(
                        { name: "User", value: `<@${u.id}>\n${u.username}` },
                        { name: "By", value: `<@${interaction.user.id}>\n${interaction.user.username}` },
                        { name: "Level", value: `${user.level - 1}` }
                    )
    
                await log.send({
                    embeds: [LogEmbed]
                });
            }
        }
    }
}