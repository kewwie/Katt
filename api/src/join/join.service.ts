/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { env } from '../env';
import axios from 'axios';

import { dataSource } from "../datasource";
import { Guild } from "../entities/Guild";

@Injectable()
export class JoinService {
    async getVanity(req: Request, res: Response, vanity: string) {
        let guild = await dataSource.getRepository(Guild).findOne({ where: { vanity: vanity } });
        if (!guild) {
            return { error: "Guild not found" };
        } else {      
            //res.cookie('joinGuild', guild.guildId, { maxAge: 900000, httpOnly: true });
            res.redirect(`${env.URL}/auth/join?guild_id=${guild.guildId}`);
        }
    }
}