import { DataSource, Repository } from "typeorm";
import { KiwiClient } from "./client";

import { dataSource } from "./datasource";

import { GuildConfigEntity } from "./entities/GuildConfig";
import { VoiceActivityEntity } from "./entities/VoiceActivity";
import { VoiceStateEntity } from "./entities/VoiceState";

export class DatabaseManager {
    private dataSource: DataSource;
    private client: KiwiClient;
    private repositories: {
        config: Repository<GuildConfigEntity>;
        voiceActivity: Repository<VoiceActivityEntity>;
        voiceState: Repository<VoiceStateEntity>;
    };

    constructor(client: KiwiClient) {
        this.client = client;
        this.dataSource = dataSource;

        this.onCreate();
    }

    private async onCreate() {
        this.repositories = {
            config: await this.dataSource.getMongoRepository(GuildConfigEntity),
            voiceActivity: await this.dataSource.getMongoRepository(VoiceActivityEntity),
            voiceState: await this.dataSource.getMongoRepository(VoiceStateEntity)
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

    /*public async setGuildConfig(guildId: string, config: GuildConfigEntity) {
        await this.repositories.config.save(config);
    }

    public async updateGuildConfig(guildId: string, config: Partial<GuildConfigEntity>) {
        let currentConfig = await this.getConfigForGuild(guildId);
        await this.repositories.config.update(currentConfig, config);
    } */

    private async createVoiceActivityForUser(userId: string, guildId: string) {
        let voiceActivity = new VoiceActivityEntity();
        voiceActivity.userId = userId;
        voiceActivity.guildId = guildId;
        voiceActivity.seconds = 0;
        await this.repositories.voiceActivity.save(voiceActivity);
        return await this.repositories.voiceActivity.findOne({ where: { userId: userId, guildId: guildId } });
    }

    private async GetVoiceActivityForUser(userId: string, guildId: string) {
        let voiceActivity = await this.repositories.voiceActivity.findOne({ where: { userId: userId, guildId: guildId } });
        if (!voiceActivity) {
            voiceActivity = await this.createVoiceActivityForUser(userId, guildId);
        }
        return voiceActivity;
    }

    public async getVoiceActivity(userId: string, guildId: string) {
        return await this.GetVoiceActivityForUser(userId, guildId);
    }

    public async getVoiceActivityLeaderboard(guildId: string) {
        let voiceLeaderboard = await this.repositories.voiceActivity.find(
            { where: { guildId: guildId }, order: { seconds: "DESC" }, take: 10 }
        );
        return voiceLeaderboard;
    }
}