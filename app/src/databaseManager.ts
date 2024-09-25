import { DataSource, Repository } from "typeorm";
import { KiwiClient } from "./client";

import { dataSource } from "./datasource";

import { GuildConfigEntity } from "./entities/GuildConfig";
import { GuildModuleEntity } from "./entities/GuildModule";
import { MemberLevelEntity } from "./entities/MemberLevel";

export class DatabaseManager {
    private dataSource: DataSource;
    private client: KiwiClient;
    private repos: {
        config: Repository<GuildConfigEntity>;
        modules: Repository<GuildModuleEntity>;
        levels: Repository<MemberLevelEntity>;
    };

    constructor(client: KiwiClient) {
        this.client = client;
        this.dataSource = dataSource;

        this.onCreate();
    }

    private async onCreate() {
        this.repos = {
            config: await this.dataSource.getMongoRepository(GuildConfigEntity),
            modules: await this.dataSource.getMongoRepository(GuildModuleEntity),
            levels: await this.dataSource.getMongoRepository(MemberLevelEntity)
        }
    }

    public async createGuildConfig(guildId: string) {
        let guildConfig = new GuildConfigEntity();
        guildConfig.guildId = guildId;
        await this.repos.config.save(guildConfig);
        return guildConfig;
    }

    public async getGuildConfig(guildId: string) {
        return await this.repos.config.findOne({ where: { guildId: guildId } });
    }

    public async saveGuildConfig(config: GuildConfigEntity) {
        return await this.repos.config.save(config);
    }

    public async enableGuildModule(guildId: string, moduleId: string) {
        var isAlreadyEnabled = await this.isModuleEnabled(guildId, moduleId);
        if (!isAlreadyEnabled) {
            let guildModule = new GuildModuleEntity();
            guildModule.guildId = guildId;
            guildModule.moduleId = moduleId;
            return await this.repos.modules.save(guildModule);
        }
    }

    public async getEnabledModules(guildId: string) {
        return (await this.repos.modules.find({ where: { guildId: guildId } })).map(module => module.moduleId);
    }

    public async isModuleEnabled(guildId: string, moduleId: string) {
        if (await this.repos.modules.findOne({ where: { guildId: guildId, moduleId: moduleId } })) {
            return true;
        } else {
            return false;
        }
    }

    public async disableGuildModule(guildId: string, moduleId: string) {
        var moduleInsert = await this.repos.modules.findOne({ where: { guildId: guildId, moduleId: moduleId } });
        return await this.repos.modules.delete({ _id: moduleInsert._id });
    }

    public async setMemberLevel(guildId: string, userId: string, level: number) {
        await this.repos.levels.delete({ guildId: guildId, userId: userId });
        if (level > 0) {
            let memberLevel = new MemberLevelEntity();
            memberLevel.guildId = guildId;
            memberLevel.userId = userId;
            memberLevel.level = level;
            return await this.repos.levels.save(memberLevel);
        }
    }

    public async getMemberLevel(guildId: string, userId: string) {
        let memberLevel = await this.repos.levels.findOne({ where: { guildId: guildId, userId: userId } });
        if (memberLevel) {
            return memberLevel.level;
        } else {
            return 0;
        }
    }
}