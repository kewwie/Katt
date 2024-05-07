/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { env } from '../env';

import { dataSource } from "../datasource";
import { Guild } from "../entities/Guild";

@Injectable()
export class JoinService {
    async getVanity(req: Request, res: Response, vanity: string) {
        let guild = await dataSource.getRepository(Guild).findOne({ where: { vanity } });
        if (!guild) {
            res.send('Guild not found');
        } else {      
            res.redirect(`${env.URL}/auth/join?guild_id=${guild.guildId}`);
        }
    }
}