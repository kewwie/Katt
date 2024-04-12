import { KiwiClient } from "../client";

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

export interface Button {
    name: string;
    config: ButtonConfig;
    execute: (interaction: any, client: KiwiClient) => void;
}

export interface ButtonConfig {
    type?: ComponentTypes.Button;
    style: ButtonStyles;
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
