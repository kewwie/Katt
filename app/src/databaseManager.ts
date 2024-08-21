import { DataSource, Repository } from "typeorm";
import { KiwiClient } from "./client";

import { dataSource } from "./datasource";

import { GuildConfigEntity } from "./entities/GuildConfig";
import { PermissionLevelEntity } from "./entities/PermissionLevel";
import { VoiceActivityEntity } from "./entities/VoiceActivity";
import { VoiceStateEntity } from "./entities/VoiceState";

export class DatabaseManager {
    private dataSource: DataSource;
    private client: KiwiClient;
    private repos: {
        config: Repository<GuildConfigEntity>;
        permissionLevel: Repository<PermissionLevelEntity>;
        voiceActivity: Repository<VoiceActivityEntity>;
        voiceState: Repository<VoiceStateEntity>;
    };

    constructor(client: KiwiClient) {
        this.client = client;
        this.dataSource = dataSource;

        this.onCreate();
    }

    private async onCreate() {
        this.repos = {
            config: await this.dataSource.getMongoRepository(GuildConfigEntity),
            permissionLevel: await this.dataSource.getMongoRepository(PermissionLevelEntity),
            voiceActivity: await this.dataSource.getMongoRepository(VoiceActivityEntity),
            voiceState: await this.dataSource.getMongoRepository(VoiceStateEntity)
        }
    }

    public async getGuildConfig(guildId: string) {
        return await this.repos.config.findOne({ where: { guildId: guildId } });
    }

    public async saveGuildConfig(config: GuildConfigEntity) {
        return await this.repos.config.save(config);
    }

    public async getPermissionLevel(guildId: string, userId: string) {
        let permission = await this.repos.permissionLevel.findOne({ where: { guildId: guildId, userId: userId } })
        return permission.level;
    }

    public async savePermissionLevel(permissionLevel: PermissionLevelEntity) {
        return await this.repos.permissionLevel.save(permissionLevel);
    }

    private async createVoiceActivityForUser(userId: string, guildId: string) {
        let voiceActivity = new VoiceActivityEntity();
        voiceActivity.userId = userId;
        voiceActivity.guildId = guildId;
        voiceActivity.seconds = 0;
        await this.repos.voiceActivity.save(voiceActivity);
        return await this.repos.voiceActivity.findOne({ where: { userId: userId, guildId: guildId } });
    }

    private async GetVoiceActivityForUser(userId: string, guildId: string) {
        let voiceActivity = await this.repos.voiceActivity.findOne({ where: { userId: userId, guildId: guildId } });
        if (!voiceActivity) {
            voiceActivity = await this.createVoiceActivityForUser(userId, guildId);
        }
        return voiceActivity;
    }

    public async getVoiceActivity(userId: string, guildId: string) {
        return await this.GetVoiceActivityForUser(userId, guildId);
    }

    public async getVoiceActivityLeaderboard(guildId: string, amount: number) {
        let voiceLeaderboard = await this.repos.voiceActivity.find(
            { where: { guildId: guildId }, order: { seconds: "DESC" }, take: amount }
        );
        return voiceLeaderboard;
    }
}