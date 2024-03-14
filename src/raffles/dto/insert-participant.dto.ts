import { IsNotEmpty, IsString } from 'class-validator';

export class InsertParticipantDto {
  @IsString()
  @IsNotEmpty()
  discordId: string;
}
