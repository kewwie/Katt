export enum ComponentType {
    ActionRow = 1,
    Button = 2,
    StringSelect = 3,
    TextInput = 4,
    UserSelect = 5,
    RoleSelect = 6,
    MentionableSelect = 7,
    ChannelSelect = 8
}

export enum ButtonStyle {
    Primary = 1,
    Secondary = 2,
    Success = 3,
    Danger = 4,
    Link = 5
}

export interface Button {
    type: ComponentType.Button;
    style: ButtonStyle;
    label?: string;
    emoji?: {
        name?: string;
        id?: string;
        animated?: boolean;
    }
    custom_id?: string;
    url?: string;
    disabled?: boolean;
}