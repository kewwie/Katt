import {  ButtonConfig, ButtonStyles, ComponentTypes } from "../types/component";

export class ButtonBuilder {
    public button: ButtonConfig;

    constructor(button: ButtonConfig) {
        this.button = button;

        if (!this.button.type) this.button.type = ComponentTypes.Button;
    }

    setCustomId(customId: string) {
        this.button.custom_id = customId;
    }

    setLabel(label: string) {
        this.button.label = label;
    }

    setStyle(style: ButtonStyles) {
        this.button.style = style;
    }

    setEmoji(emoji: { name?: string; id?: string; animated?: boolean; }) {
        this.button.emoji = emoji;
    }

    setUrl(url: string) {
        this.button.url = url;
    }

    setDisabled(disabled: boolean) {
        this.button.disabled = disabled;
    }

    toJSON() {
        return this.button;
    }
};