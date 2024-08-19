import { DataSource, Repository } from "typeorm";
import { KiwiClient } from "./client";

import { dataSource } from "./datasource";

import { GuildConfigEntity } from "./entities/GuildConfig";

export class DatabaseManager {
    private dataSource: DataSource;
    private client: KiwiClient;
    private repositories: {
        config: Repository<GuildConfigEntity>;
    };

    constructor(client: KiwiClient) {
        this.client = client;
        this.dataSource = dataSource;

        this.onCreate();
    }

    private async onCreate() {
        this.repositories = {
            config: await this.dataSource.getMongoRepository(GuildConfigEntity),
        }
    }

    private async createConfigForGuild(guildId: string) {
        let config = new GuildConfigEntity();
        config.guildId = guildId;
        await this.repositories.config.save(config);
        return await this.repositories.config.findOne({ where: { guildId: guildId } });
    }

    private async getConfigForGuild(guildId: string) {
        let config = await this.repositories.config.findOne({ where: { guildId: guildId } });
        if (!config) {
            config = await this.createConfigForGuild(guildId);
        }
        return config;
    }

    public async getGuildConfig(guildId: string) {
        return await this.getConfigForGuild(guildId);
    }

    
}