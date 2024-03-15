import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InsertParticipantDto {

  @ApiProperty({
    type: String,
    description: 'The Discord ID of the participant.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  discordId: string;
}
