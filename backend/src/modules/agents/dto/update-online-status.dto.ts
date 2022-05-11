import { IsBoolean } from 'class-validator';

export class UpdateOnlineStatusDto {
  @IsBoolean()
  status: boolean;
}
