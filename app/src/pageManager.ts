import {
    ActionRowBuilder,
    BaseInteraction,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    EmbedBuilder,
    MessageComponentInteraction,
    RoleSelectMenuBuilder,
    StringSelectMenuBuilder,
    User,
} from "discord.js";
import { KiwiClient } from "./client";

export class PageManager {
    private client: KiwiClient;

    constructor(client: KiwiClient) {
        this.client = client;
    }

    generateButton(buttonConfig: {
        customId: string;
        label: string;
        style?: ButtonStyle;
        disabled?: boolean;       
    }) {
        const { customId, label, style, disabled } = buttonConfig;

        let button = new ButtonBuilder()
            .setCustomId(customId)
            .setLabel(label);

        if (style) button.setStyle(style);
        if (disabled) button.setDisabled(disabled);

        return button;
    }

    generateSelectMenu(menuConfig: {
        customId: string;
        placeholder: string;
        maxValues?: number;
        minValues?: number;
        options?: Array<{ label: string; value: string; description?: string; }>;
        channelTypes?: ChannelType[];
        defaults?: string[];
        type: "string" | "channel" | "role";
    }) {
        const { customId, placeholder, maxValues, minValues, options, channelTypes, defaults, type } = menuConfig;

        let selectMenu;
        switch (type) {
            case "string":
                selectMenu = new StringSelectMenuBuilder();
                break;

            case "role":
                selectMenu = new RoleSelectMenuBuilder();
                break;

            case "channel":
                selectMenu = new ChannelSelectMenuBuilder();
                break;
        }

        selectMenu.setCustomId(customId).setPlaceholder(placeholder);
        if (maxValues) selectMenu.setMaxValues(maxValues);
        if (minValues) selectMenu.setMinValues(minValues); else selectMenu.setMinValues(0);

        if (type === "string") {
            options.forEach((option) => {
                let isDefault = defaults?.includes(option.value) ? true : false;
                selectMenu.addOptions({
                    label: option.label,
                    value: option.value,
                    description: option.description,
                    default: isDefault,
                })
            });
        } else if (type === "role") {
            selectMenu.setDefaultRoles(defaults);
        } else if (type === "channel") {
            selectMenu.setDefaultChannels(defaults);
            if (channelTypes) selectMenu.setChannelTypes(channelTypes);
        }

        return selectMenu;
    }

    generateEmbed(options: 
        {
            title?: string,
            description?: string,
            thumbnail?: string,
            fields?: Array<{ name: string, value: string, inline?: boolean }>,
            user?: User,
        }
    ) {
        const embed = new EmbedBuilder().setColor(this.client.Settings.color);

        if (options.title) embed.setTitle(this.client.capitalize(options.title));
        if (options.description) embed.setDescription(options.description);
        if (options.thumbnail) embed.setThumbnail(options.thumbnail);
        if (options.fields) embed.addFields(options.fields);
        if (options.user) {
            embed.setFooter({
                text: `${this.client.capitalize(options.user.displayName)} (${options.user.username})`,
                iconURL: options.user.avatarURL(),
            });
        }

        return embed;
    }
}