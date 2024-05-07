/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { env } from '../env';
import axios from 'axios';
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

import { dataSource } from "../datasource";
import { Login } from '../entities/Login';
import { AuthUser } from '../entities/AuthUser';
import { Guild } from "../entities/Guild";

import { createCipheriv, randomBytes, randomUUID } from 'crypto';

@Injectable()
export class AuthService {
    async getAuth(req: Request, res: Response) {

        let OAuthData = new URLSearchParams({
            client_id: String(env.CLIENT_ID),
            response_type: "code",
            redirect_uri: env.URL + "/auth/callback",
            scope: ["identify", "guilds"].join(" ")
        });
        res.redirect(`https://discord.com/oauth2/authorize?${OAuthData}`);
    }

    async getCallback(req: Request, res: Response, code: string) {
        
        let TokenData = new URLSearchParams({
            client_id:  String(env.CLIENT_ID),
            client_secret: String(env.CLIENT_SECRET),
            grant_type: "authorization_code",
            code: code,
            redirect_uri: env.URL + "/auth/callback",
        });

        let response = await axios.post(
            `https://discord.com/api/oauth2/token`,
            TokenData
        ).then(response => response.data);

        let expiresIn = response.expires_in;
        let t = new Date();
        t.setSeconds(t.getSeconds() + expiresIn);

        let user = await axios.get(
            'https://discord.com/api/oauth2/@me',
            {
                headers: {
                    'authorization': `${response.token_type} ${response.access_token}`
                }
            }
        ).then((response) => {
            return response.data.user;
        });

        let loginsDb = await dataSource.getRepository(Login);

        let tokenArray = new Array<string>();

        tokenArray.push(Buffer.from(user.id).toString('base64'));
        tokenArray.push(Buffer.from(Math.floor(Date.now() / 10000).toString()).toString('base64'));

        let cipher = createCipheriv('aes-256-cbc', env.KEY, randomBytes(16));
        let encrypted = cipher.update(randomUUID().substring(0, 16), 'utf8', 'hex') +  cipher.final('hex');
        tokenArray.push(encrypted);

        let token: string = tokenArray.join(".");

        const existingLogin = await loginsDb.findOne({ where: { userId: user.id }});

        if (existingLogin) {
            // Update the existing login
            await loginsDb.update(existingLogin.userId, {
                token,
                tokenType: response.token_type,
                accessToken: response.access_token,
                expires: t,
                refreshToken: response.refresh_token,
                username: user.username,
                discriminator: user.discriminator,
                tag: user.username + "#" + user.discriminator,
                avatarUrl: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
            });
        } else {
            // Insert a new login
            await loginsDb.insert({
                userId: user.id,
                token,
                tokenType: response.token_type,
                accessToken: response.access_token,
                expires: t,
                refreshToken: response.refresh_token,
                username: user.username,
                discriminator: user.discriminator,
                tag: user.username + "#" + user.discriminator,
                avatarUrl: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
            });
        }

        res.redirect(`${env.URL}/login/callback?token=${token}`);
    }

    async getJoinAuth(req: Request, res: Response, guildId: string) {

        if (!guildId) {
            return res.status(400).send('Missing guild_id');
        }

        res.cookie('guild_id', guildId);


        let OAuthData = new URLSearchParams({
            client_id: String(env.CLIENT_ID),
            response_type: "code",
            redirect_uri: env.URL + "/auth/join/callback",
            scope: ["identify", "guilds", "guilds.join", "gdm.join"].join(" ")
        });
        res.redirect(`https://discord.com/oauth2/authorize?${OAuthData}`);
    }

    async getJoinCallback(req: Request, res: Response, code: string) {
        
        let TokenData = new URLSearchParams({
            client_id:  String(env.CLIENT_ID),
            client_secret: String(env.CLIENT_SECRET),
            grant_type: "authorization_code",
            code: code,
            redirect_uri: env.URL + "/auth/join/callback",
        });

        let response = await axios.post(
            `https://discord.com/api/oauth2/token`,
            TokenData
        ).then(response => response.data);

        let expiresIn = response.expires_in;
        let t = new Date();
        t.setSeconds(t.getSeconds() + expiresIn);

        let user = await axios.get(
            'https://discord.com/api/oauth2/@me',
            {
                headers: {
                    'authorization': `${response.token_type} ${response.access_token}`
                }
            }
        ).then((response) => {
            return response.data.user;
        });

        const authUserRepository = await dataSource.getRepository(AuthUser);
        const existingAuth = await authUserRepository.findOne({ where: { userId: user.id }});

        if (existingAuth) {
            // Update the existing login
            await authUserRepository.update(existingAuth.userId, {
                tokenType: response.token_type,
                accessToken: response.access_token,
                expires: t,
                refreshToken: response.refresh_token,
                username: user.username,
                discriminator: user.discriminator,
                tag: user.username + "#" + user.discriminator,
                avatarUrl: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
            });
        } else {
            // Insert a new login
            await authUserRepository.insert({
                userId: user.id,
                tokenType: response.token_type,
                accessToken: response.access_token,
                expires: t,
                refreshToken: response.refresh_token,
                username: user.username,
                discriminator: user.discriminator,
                tag: user.username + "#" + user.discriminator,
                avatarUrl: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
            });
        }

        var guildId = req.cookies.guild_id;
        if (!guildId) {
            res.send("Guild ID not found in cookies.");
            return;
        }

        var userGuilds = await axios.get(
            `https://discord.com/api/users/@me/guilds`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `${response.token_type} ${response.access_token}`
                }
            }
        ).then((response) => {
            return response.data;
        });

        console.log(userGuilds)

        if (userGuilds.find((g) => g.id === guildId)) {
            res.redirect(`https://discord.com/channels/${guildId}`);
            return;
        }

        const GuildRepository = await dataSource.getRepository(Guild);
        var GuildData = await GuildRepository.findOne({ where: { guildId: guildId }});
        if (!GuildData) {
            res.send("This guild doesnt use the verification system");
            return;
        }

        var guildChannels = await axios.get(
            `https://discord.com/api/guilds/${guildId}/channels`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bot ${env.CLIENT_TOKEN}`
                }
            }
        ).then((response) => {
            return response.data;
        }).catch((error) => {
            res.send(error.response.data.message);
            return;
        });

        var guildRoles = await axios.get(
            `https://discord.com/api/guilds/${guildId}/roles`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bot ${env.CLIENT_TOKEN}`
                }
            }
        ).then((response) => {
            return response.data;
        }).catch((error) => {
            res.send(error.response.data.message);
            return;
        });

        if (
            !guildChannels && !guildRoles &&
            !guildChannels.find((c) => c.id === GuildData.pendingChannel) &&
            !guildChannels.find((c) => c.id === GuildData.logsChannel) &&
            !guildRoles.find((r) => r.id === GuildData.guestRole) &&
            !guildRoles.find((r) => r.id === GuildData.memberRole)
        ) {
            res.send("This guild hasnt set up the verification system yet")
            return;
        }

        
                        
        await axios.post(
            `https://discord.com/api/channels/${GuildData.pendingChannel}/messages`,
            {
                content: GuildData.verificationPing ? `<@&${GuildData.verificationPing}>` : "@everyone",
                embeds: [
                    {   
                        color: 0xADD8E6,
                        thumbnail: { url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` },
                        fields: [
                            { name: "User", value: `<@${user.id}>` },
                            { name: "Username", value: user.username }
                        ]
                    }
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 3,
                                label: "Approve as Guest",
                                custom_id: "approve-guest_" + user.id,
                            },
                            {
                                type: 2,
                                style: 1,
                                label: "Approve as Member",
                                custom_id: "approve-member_" + user.id,
                            },
                            {
                                type: 2,
                                style: 4,
                                label: "Deny",
                                custom_id: "deny-user_" + user.id,
                            }
                        ]
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bot ${env.CLIENT_TOKEN}`
                }
            }
        ).then((response) => {
            return response.data;
        }).catch((error) => {
            res.send(error.response.data.message);
            return;
        });


        res.send("You will be notified in Discord when and if your request is approved.")


    }
}