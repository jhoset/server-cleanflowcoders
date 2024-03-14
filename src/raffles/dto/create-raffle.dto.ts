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
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  timezone: string;

  @Validate(IsValidDateFormat)
  @IsNotEmpty()
  @Transform(({ value, obj }: TransformFnParams) =>
    TimezoneAdapter.convertToSystemTimezone(value, obj.timezone).format(
      'YYYY-MM-DD HH:mm:ss',
    ),
  )
  @Validate(IsFutureDate)
  startInscriptionDate: string;

  @Validate(IsValidDateFormat)
  @IsNotEmpty()
  @Transform(({ value, obj }: TransformFnParams) =>
    TimezoneAdapter.convertToSystemTimezone(value, obj.timezone).format(
      'YYYY-MM-DD HH:mm:ss',
    ),
  )
  @Validate(IsAfterStartDate)
  endInscriptionDate: string;

  @IsNotEmpty()
  @Validate(IsValidDateFormat)
  @Transform(({ value, obj }: TransformFnParams) =>
    TimezoneAdapter.convertToSystemTimezone(value, obj.timezone).format(
      'YYYY-MM-DD HH:mm:ss',
    ),
  )
  @Validate(IsAfterEndDate)
  date: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  maxParticipants: number;

  @IsUrl()
  @IsNotEmpty()
  graphicURL: string;

  isPlay: boolean;
}
