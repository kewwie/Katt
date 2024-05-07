import { JoinService } from './join.service';
import { JoinController } from './join.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [JoinController],
  providers: [JoinService],
})
export class JoinModule {}