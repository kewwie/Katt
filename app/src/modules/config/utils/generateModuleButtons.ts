import { KiwiClient } from "../../../client";
import { ButtonBuilder, User } from "discord.js";

import { ConfigToggleButton } from "../buttons/configToggle";
import { ModuleInfoButton } from "../buttons/moduleInfo";
import { ConfigCancelButton } from "../buttons/configCancel";

export const generateModuleButtons = (client: KiwiClient, config: { pageId: string, pageOwner: User }) => {
    const { pageId, pageOwner } = config;

    var toggleModuleButton = ConfigToggleButton.config as ButtonBuilder;
    var moduleInfoButton = ModuleInfoButton.config as ButtonBuilder;

    return [
        client.Pages.generateButton({
            customId: client.createCustomId({ 
                customId: ConfigToggleButton.customId,
                optionOne: pageId,
                ownerId: pageOwner.id 
            }),
            label: toggleModuleButton.data.label,
            style: toggleModuleButton.data.style,
        }),
        client.Pages.generateButton({
            customId: client.createCustomId({ 
                customId: ModuleInfoButton.customId,
                optionOne: pageId,
                ownerId: pageOwner.id 
            }),
            label: moduleInfoButton.data.label,
            style: moduleInfoButton.data.style,
        }),
        ConfigCancelButton.config.setCustomId(
            client.createCustomId({
                customId: ConfigCancelButton.customId,
                ownerId: pageOwner.id
            })
        )
    ];
}