import { KiwiClient } from "../../../client";

import { 
    ButtonStyle,
    ComponentType,
    ButtonInteraction,
    EmbedBuilder,
    TextChannel
} from "discord.js";

import { Button } from "../../../types/component";

import { dataSource } from "../../../data/datasource";
import { Guild } from "../../../data/entities/Guild";
import { Group } from "../../../data/entities/Group";
import { GroupMember } from "../../../data/entities/GroupMember";

export const AcceptMember: Button = {
    config: {
        type: ComponentType.Button,
        custom_id: "accept-member",
        style: ButtonStyle.Primary,
        label: "Accept as Member"
    },
    
    /**
    * @param {ButtonInteraction} interaction
    * @param {Client} client
    */
    async execute(interaction: ButtonInteraction, client: KiwiClient) {
        await interaction.deferUpdate();
        var memberId = interaction.customId.split("_")[1];

        const GuildRepository = await dataSource.getRepository(Guild);
        const GroupRepository = await dataSource.getRepository(Group);
        const GroupMembersRepository = await dataSource.getRepository(GroupMember);
        const guild = await GuildRepository.findOne({ where: { guildId: interaction.guild.id } });
        
        var member = await interaction.guild.members.fetch(memberId);
       
        if (guild) {
            var guestRole = member.guild.roles.cache.find(role => role.id === guild.guestRole);
            if (guestRole) {
                await member.roles.add(guestRole);
            }
            var memberRole = member.guild.roles.cache.find(role => role.id === guild.memberRole);
            if (memberRole) {
                await member.roles.add(memberRole);
            }

            const groups = await GroupMembersRepository.find({ where: { userId: member.id } });
            for (const g of groups) {
                const group = await GroupRepository.findOne({ where: { groupId: g.groupId } });
                const role = member.guild.roles.cache.find(role => role.id === group.roleId);
                if (role) {
                    await member.roles.add(role);
                }
            }
            var message = await interaction.channel.messages.fetch(interaction.message.id);
            if (message) {
                await message.delete();
            }
            await member.send(`You have been **verified** in **${interaction.guild.name}**`);

            if (guild.logsChannel) {
                var log = member.guild.channels.cache.get(guild.logsChannel) as TextChannel;
                if (!log) return;

                var addedRoles = member.roles.cache
                    .filter((roles) => roles.id !== member.guild.id)
                    .sort((a, b) => b.rawPosition - a.rawPosition)
                    .map((role) => role.name);
    
                var em = new EmbedBuilder()
                    .setTitle(member.user.username + "#" + member.user.discriminator)
                    .setThumbnail(member.user.avatarURL())
                    .setColor(0x90EE90)
                    .addFields(
                        { name: "Mention", value: `<@${member.user.id}>\n${member.user.username}` },
                        { name: "Verified By", value: `<@${interaction.member.user.id}>` },
                        { name: "Type", value: "Member" },
                    )
    
                await log.send({
                    embeds: [em]
                });
            }
        } else {
            interaction.editReply("This guild is not in the database.");
        }
    }
}