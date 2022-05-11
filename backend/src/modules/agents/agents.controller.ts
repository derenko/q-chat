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
import { AgentsService } from './agents.service';
import {
  CreateTemplateDto,
  UpdateAgentDto,
  UpdateOnlineStatusDto,
  UpdateTemplateDto,
} from './dto';

@Controller('agents')
export class AgentsController {
  constructor(private agentService: AgentsService) {}

  @Get('/profile')
  async getProfile(@GetCurrentUser('id') id: number) {
    return this.agentService.getProfile(id);
  }

  @Patch('/profile')
  async updateProfile(
    @GetCurrentUser('id') id: number,
    @Body() dto: UpdateAgentDto,
  ) {
    return this.agentService.updateProfile(id, dto);
  }

  @Get('/templates')
  async getTemplate(@GetCurrentUser('id') id: number) {
    return this.agentService.getTemplatesForAgent(id);
  }

  @Post('/templates')
  async createTemplate(
    @GetCurrentUser('id') id: number,
    @Body() dto: CreateTemplateDto,
  ) {
    return this.agentService.createTemplateForAgent(id, dto);
  }

  @Patch('/templates')
  async updateTemplate(
    @GetCurrentUser('id') id: number,
    @Body() dto: UpdateTemplateDto,
  ) {
    return this.agentService.updateTemplate(dto.templateId, dto.text);
  }

  @Delete('/templates/:id')
  async deleteTemplate(@Param('id', ParseIntPipe) id: number) {
    return this.agentService.deleteTemplate(id);
  }

  @Patch('/online-status')
  async updateOnlineStatus(
    @GetCurrentUser('id') id: number,
    @Body() dto: UpdateOnlineStatusDto,
  ) {
    return this.agentService.updateOnlineStatus(id, dto.status);
  }

  @Get('/handbooks')
  async getHandbooks(@GetCurrentUser('id') id: number) {
    return this.agentService.getHandbooks(id);
  }
}
