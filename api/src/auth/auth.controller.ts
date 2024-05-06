/*
https://docs.nestjs.com/controllers#controllers
*/

import { Query, Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get() // GET /auth
    getAuth(@Req() req: Request, @Res() res: Response) {
        this.authService.getAuth(req, res);
    }

    @Get('/callback') // GET /auth/callback
    getCallback(
        @Req() req: Request,
        @Res() res: Response,
        @Query("code") code: string,
    ) {
        this.authService.getCallback(req, res, code);
    }

    @Get("/join") // GET /auth/join
    getJoinAuth(
        @Req() req: Request,
        @Res() res: Response,
        @Query("guild_id") guildId: string,
    ) {
        this.authService.getJoinAuth(req, res, guildId);
    }

    @Get('/join/callback') // GET /auth/join/callback
    getJoinCallback(
        @Req() req: Request,
        @Res() res: Response,
        @Query("code") code: string,
    ) {
        this.authService.getJoinCallback(req, res, code);
    }
}