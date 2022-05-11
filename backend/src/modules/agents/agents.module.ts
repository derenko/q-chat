import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentsController } from './agents.controller';

@Module({
  imports: [],
  controllers: [AgentsController],
  providers: [AgentsService],
})
export class AgentsModule {}
