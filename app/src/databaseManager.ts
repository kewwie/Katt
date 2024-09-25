import { DataSource, Repository } from "typeorm";
import { KiwiClient } from "./client";

import { dataSource } from "./datasource";

import { ActivityConfigEntity } from "./entities/ActivityConfig";
import { GuildConfigEntity } from "./entities/GuildConfig";
import { GuildModuleEntity } from "./entities/GuildModule";
import { MemberLevelEntity } from "./entities/MemberLevel";

export class DatabaseManager {
    private dataSource: DataSource;
    private client: KiwiClient;
    private repos: {
        activityConfig: Repository<ActivityConfigEntity>;
        guildModules: Repository<GuildModuleEntity>;
        memberLevels: Repository<MemberLevelEntity>;
    };

    constructor(client: KiwiClient) {
        this.client = client;
        this.dataSource = dataSource;

        this.onCreate();
    }

    private async onCreate() {
        this.repos = {
            activityConfig: await this.dataSource.getMongoRepository(ActivityConfigEntity),
            guildModules: await this.dataSource.getMongoRepository(GuildModuleEntity),
            memberLevels: await this.dataSource.getMongoRepository(MemberLevelEntity)
        }
    }

    public async generateConfigs(guildId: string) {
        var activityConfig = await this.getActivityConfig(guildId);
        if (!activityConfig) {
            await this.createActivityConfig(guildId);
            console.log(`Activity Config Created for ${guildId}`);
        }
    }

    public async createActivityConfig(guildId: string) {
        let activityConfig = new ActivityConfigEntity();
        activityConfig.guildId = guildId;
        return await this.repos.activityConfig.save(activityConfig);
    }

    public async getActivityConfig(guildId: string) {
        return await this.repos.activityConfig.findOne({ where: { guildId: guildId } });
    }

    public async saveActivityConfig(config: GuildConfigEntity) {
        return await this.repos.activityConfig.save(config);
    }

    public async enableGuildModule(guildId: string, moduleId: string) {
        var isAlreadyEnabled = await this.isModuleEnabled(guildId, moduleId);
        if (!isAlreadyEnabled) {
            let guildModule = new GuildModuleEntity();
            guildModule.guildId = guildId;
            guildModule.moduleId = moduleId;
            return await this.repos.guildModules.save(guildModule);
        }
    }

    public async getEnabledModules(guildId: string) {
        return (await this.repos.guildModules.find({ where: { guildId: guildId } })).map(module => module.moduleId);
    }

    public async isModuleEnabled(guildId: string, moduleId: string) {
        if (await this.repos.guildModules.findOne({ where: { guildId: guildId, moduleId: moduleId } })) {
            return true;
        } else {
            return false;
        }
    }

    public async disableGuildModule(guildId: string, moduleId: string) {
        var moduleInsert = await this.repos.guildModules.findOne({ where: { guildId: guildId, moduleId: moduleId } });
        return await this.repos.guildModules.delete({ _id: moduleInsert._id });
    }

    public async setMemberLevel(guildId: string, userId: string, level: number) {
        var memberLevel = await this.repos.memberLevels.findOne({ where: { guildId: guildId, userId: userId } });
        await this.repos.guildModules.delete({ _id: memberLevel._id });
        if (level > 0) {
            let memberLevel = new MemberLevelEntity();
            memberLevel.guildId = guildId;
            memberLevel.userId = userId;
            memberLevel.level = level;
            return await this.repos.memberLevels.save(memberLevel);
        }
    }

    public async getMemberLevel(guildId: string, userId: string) {
        let memberLevel = await this.repos.memberLevels.findOne({ where: { guildId: guildId, userId: userId } });
        if (memberLevel) {
            return memberLevel.level;
        } else {
            return 0;
        }
    }
}