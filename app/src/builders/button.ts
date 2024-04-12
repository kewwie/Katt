import {  ButtonConfig, ButtonStyles, ComponentTypes } from "../types/component";

export class ButtonBuilder {
    public button: ButtonConfig;

    constructor() {}

    public setButton(button: ButtonConfig) {
        this.button = button;
        return this;
    }

    public setCustomId(customId: string) {
        this.button.custom_id = customId;
        return this;
    }

    public setLabel(label: string) {
        this.button.label = label;
        return this;
    }

    public setStyle(style: ButtonStyles) {
        this.button.style = style;
        return this;
    }

    public setEmoji(emoji: { name?: string; id?: string; animated?: boolean; }) {
        this.button.emoji = emoji;
        return this;
    }

    public setUrl(url: string) {
        this.button.url = url;
        return this;
    }

    public setDisabled(disabled: boolean) {
        this.button.disabled = disabled;
        return this;
    }

    public toJSON() {
        this.button.type = ComponentTypes.Button;
        return this.button;
    }
};