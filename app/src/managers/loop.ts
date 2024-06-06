import { KiwiClient } from "../client";
import { dataSource } from "../datasource";

import { GuildPlugins } from "../entities/GuildPlugins";
import { Loop } from "../types/loop";

export class LoopManager {
    private client: KiwiClient;

    constructor(client: KiwiClient) {
        this.client = client;
    }

    async load(loops: Loop[]) {
        const GuildPluginsRepository = await dataSource.getRepository(GuildPlugins);

        for (let loop of loops) {
            this.client.loops.set(loop.name, loop);

            setInterval(async () => {
                var plugin = this.client.PluginManager.plugins.find(plugin => plugin.config.name === loop.plugin);
                for (let [_, guild] of await this.client.guilds.fetch()) {
                    var g = await guild.fetch();

                    if (!plugin.config.disableable) {
                        
                    } else {
                        var isEnabled = await GuildPluginsRepository.findOne({ where: { guild_id: g.id, plugin: loop.plugin } });
                        if (isEnabled) {
                            await loop.execute(this.client, g);
                        }
                    }
                }
            }, loop.seconds * 1000);
        }
    }
};