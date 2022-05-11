import { Body, Controller, Get, ParseIntPipe, Post } from '@nestjs/common';
import { GetCurrentUser } from 'src/common/decorators';
import { CreateAgentDto } from './dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get('/agents')
  getAgentsForProject(@GetCurrentUser('id', ParseIntPipe) id: number) {
    return this.projectsService.getAgentsForProject(id);
  }

  @Post('/agents')
  createAgentForProject(
    @GetCurrentUser('id', ParseIntPipe) id: number,
    @Body() dto: CreateAgentDto,
  ) {
    return this.projectsService.createAgent(id, dto);
  }

  @Get('/clients')
  getClientsForProject(@GetCurrentUser('id', ParseIntPipe) id: number) {
    return this.projectsService.getClientsForProject(id);
  }

  @Get('/statistic')
  getStatisticForProject(@GetCurrentUser('id', ParseIntPipe) id: number) {
    return this.projectsService.getStatisticForProject(id);
  }

  @Get('/handbooks')
  getHandbooksForProject(@GetCurrentUser('id', ParseIntPipe) id: number) {
    return this.projectsService.getHandbooksForProject(id);
  }
}
