import {  ButtonConfig, ButtonStyles } from "../types/component";

export class ComponentHandler {
    private button: ButtonConfig;

    constructor(button: ButtonConfig) {
        this.button = button;
    }

    setCustomId(customId: string) {

    }

    setLabel(label: string) {

    }

    setStyle(style: ButtonStyles) {

    }

    setEmoji(emoji: { name?: string; id?: string; animated?: boolean; }) {

    }

    setUrl(url: string) {

    }

    setDisabled(disabled: boolean) {

    }
};