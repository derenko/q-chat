import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class DeleteAgentDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  agentId: number;
}
