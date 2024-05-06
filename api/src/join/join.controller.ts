/*
https://docs.nestjs.com/controllers#controllers
*/

import { Query, Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { JoinService } from './join.service';

@Controller({ path: 'join', version: '1' })
export class JoinController {
    constructor(private joinService: JoinService) {}

    @Get('/:vanity') // GET /join/:vanity
    getVanity(@Req() req: Request, @Res() res: Response) {
        const vanity = req.params.id;
        this.joinService.getVanity(req, res, vanity);
    }
}