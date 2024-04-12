import { KiwiClient } from "../client";
import { Button } from "../types/component";

export class ComponentManager {
    public client: KiwiClient;

    constructor(client: KiwiClient) {
        this.client = client;
    }

    public loadButtons(buttons: Button[]) {
        for (var button of buttons) {
            this.client.buttons.set(button.name, button);
        }
    }

    async onInteraction(interaction: any) {
        if (interaction.isButton()) {
            const buttonId = (interaction.customId).split("_")[0];
            const button = this.client.buttons.get(buttonId);

            if (!button) return;

            try {
                await button.execute(interaction, this.client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
};