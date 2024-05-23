import { KiwiClient } from "../client";

import { APIButtonComponent, APIButtonComponentWithCustomId, ComponentType } from "discord-api-types/v10";


export interface Button {
    config: APIButtonComponentWithCustomId;
    plugin?: string;
    dms?: boolean;
    execute: (interaction: any, client: KiwiClient) => void;
}



export enum ComponentTypes {
    ActionRow = 1,
    Button = 2,
    StringSelect = 3,
    TextInput = 4,
    UserSelect = 5,
    RoleSelect = 6,
    MentionableSelect = 7,
    ChannelSelect = 8,
}

export interface Row {
    type: ComponentTypes.ActionRow;
    components: Button[];
}

export enum ButtonStyles {
    Primary = 1,
    Secondary = 2,
    Success = 3,
    Danger = 4,
    Link = 5,
}

export interface ButtonData {
    style?: ButtonStyles;
    label?: string;
    emoji?: {
        name?: string;
        id?: string;
        animated?: boolean;
    };
    custom_id?: string;
    url?: string;
    disabled?: boolean;
}
