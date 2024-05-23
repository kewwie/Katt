import { KiwiClient } from "../../../client";

import { 
    ButtonStyle,
    ComponentType,
    ButtonInteraction
} from "discord.js";

import { Button } from "../../../types/component";

import { dataSource } from "../../../data/datasource";
import { Group } from "../../../data/entities/Group";
import { GroupMember } from "../../../data/entities/GroupMember";
import { GroupInvite } from "../../../data/entities/GroupInvite";

/**
 * @type {Button}
 */
export const AcceptInvite: Button = {
    config: {
        type: ComponentType.Button,
        custom_id: "accept-invite",
        style: ButtonStyle.Success,
        label: "Accept"
    },
    
    /**
    * @param {ButtonInteraction} interaction
    * @param {Client} client
    */
    async execute(interaction: ButtonInteraction, client: KiwiClient) {
        interaction.deferUpdate();
        var userId = interaction.customId.split("_")[1];

        const GroupRepository = await dataSource.getRepository(Group);
        const GroupMembersRepository = await dataSource.getRepository(GroupMember);
        const GroupInvitesRepository = await dataSource.getRepository(GroupInvite);
      
    }
}