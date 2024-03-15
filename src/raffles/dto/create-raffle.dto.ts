import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsValidDateFormat, IsFutureDate } from '../../common/validators';
import { TimezoneAdapter } from '../../common/adapters';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@ValidatorConstraint({ name: 'isAfterStartDate', async: false })
export class IsAfterStartDate implements ValidatorConstraintInterface {
  validate(endInscriptionDate: string, args: ValidationArguments) {
    const createRaffleDto = args.object as CreateRaffleDto;
    const EndDate = new Date(endInscriptionDate);
    const StartDate = new Date(createRaffleDto.startInscriptionDate);
    console.log(endInscriptionDate, createRaffleDto.startInscriptionDate);
    return EndDate > StartDate;
  }

  defaultMessage(args: ValidationArguments) {
    return 'End inscription date must be after start inscription date.';
  }
}

@ValidatorConstraint({ name: 'isAfterEndDate', async: false })
export class IsAfterEndDate implements ValidatorConstraintInterface {
  validate(date: string, args: ValidationArguments) {
    const createRaffleDto = args.object as CreateRaffleDto;
    const dateRaffle = new Date(date);
    const endDate = new Date(createRaffleDto.endInscriptionDate);
    return dateRaffle > endDate;
  }

  defaultMessage(args: ValidationArguments) {
    return 'date must be after the end inscription date.';
  }
}
export class CreateRaffleDto {
  @ApiProperty({
    type: String,
    description: 'The name of the raffle.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    type: String,
    description: 'The description of the raffle.',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    type: String,
    description: 'The timezone.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  timezone: string;

  @ApiProperty({
    type: String,
    description: 'The start date and time for participants to join the raffle. Must be in valid date format.',
    required: true,
  })
  @Validate(IsValidDateFormat)
  @IsNotEmpty()
  @Transform(({ value, obj }: TransformFnParams) =>
    TimezoneAdapter.convertToSystemTimezone(value, obj.timezone).format(
      'YYYY-MM-DD HH:mm:ss',
    ),
  )
  @Validate(IsFutureDate)
  startInscriptionDate: string;

  @ApiProperty({
    type: String,
    description: 'The end date and time for participants to join the raffle. Must be in valid date format and after startInscriptionDate.',
    required: true,
  })
  @Validate(IsValidDateFormat)
  @IsNotEmpty()
  @Transform(({ value, obj }: TransformFnParams) =>
    TimezoneAdapter.convertToSystemTimezone(value, obj.timezone).format(
      'YYYY-MM-DD HH:mm:ss',
    ),
  )
  @Validate(IsAfterStartDate)
  endInscriptionDate: string;

  @ApiProperty({
    type: String,
    description: 'The date and time when the raffle will occur. Must be in valid date format and after endInscriptionDate.',
    required: true,
  })
  @IsNotEmpty()
  @Validate(IsValidDateFormat)
  @Transform(({ value, obj }: TransformFnParams) =>
    TimezoneAdapter.convertToSystemTimezone(value, obj.timezone).format(
      'YYYY-MM-DD HH:mm:ss',
    ),
  )
  @Validate(IsAfterEndDate)
  date: string;

  @ApiProperty({
    type: Number,
    description: 'The maximum number of participants allowed in the raffle.',
    required: true,
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  maxParticipants: number;

  @ApiProperty({
    type: String,
    description: 'The URL of the graphic associated with the raffle.',
    required: true,
  })
  @IsUrl()
  @IsNotEmpty()
  graphicURL: string;

  @ApiProperty({
    type: Boolean,
    description: 'A boolean value indicating if the raffle allows participation.',
    required: true,
  })
  isPlay: boolean;
}
