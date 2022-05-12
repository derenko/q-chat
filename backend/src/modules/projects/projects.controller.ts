import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { GetCurrentUser } from 'src/common/decorators';
import { CreateAgentDto, CreateHandbookDto, UpdateProjectDto } from './dto';
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

  @Patch('/')
  updateProject(
    @GetCurrentUser('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.updateProject(id, dto);
  }

  @Post('/handbooks')
  createHandbookForProject(
    @GetCurrentUser('id', ParseIntPipe) id: number,
    @Body() dto: CreateHandbookDto,
  ) {
    return this.projectsService.createHandbookForProject(id, dto);
  }

  @Patch('/handbooks/:id')
  updateHandbookForProject(
    @GetCurrentUser('id', ParseIntPipe) id: number,
    @Param('id', ParseIntPipe) handbookId: number,
    @Body() dto: CreateHandbookDto,
  ) {
    return this.projectsService.updateHandbookForProject(id, handbookId, dto);
  }

  @Delete('/handbooks/:id')
  deleteHandbookForProject(
    @GetCurrentUser('id', ParseIntPipe) id: number,
    @Param('id', ParseIntPipe) handbookId: number,
  ) {
    return this.projectsService.deleteHandbookForProject(id, handbookId);
  }
}
