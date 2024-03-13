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
  validate(startInscriptionDate: string, args: ValidationArguments) {
    const createRaffleDto = args.object as CreateRaffleDto;
    const startDate = new Date(startInscriptionDate);
    const date = new Date(createRaffleDto.date);
    return startDate > date;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Start inscription date must be after the raffle date.';
  }
}

@ValidatorConstraint({ name: 'isAfterEndDate', async: false })
export class IsAfterEndDate implements ValidatorConstraintInterface {
  validate(endInscriptionDate: string, args: ValidationArguments) {
    const createRaffleDto = args.object as CreateRaffleDto;
    const endDate = new Date(endInscriptionDate);
    const startDate = new Date(createRaffleDto.startInscriptionDate);
    return endDate > startDate;
  }

  defaultMessage(args: ValidationArguments) {
    return 'End inscription date must be after the start inscription date.';
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

  @IsNotEmpty()
  @Validate(IsValidDateFormat)
  @Transform(({ value, obj }: TransformFnParams) =>
    TimezoneAdapter.convertToSystemTimezone(value, obj.timezone).format(
      'YYYY-MM-DD HH:mm:ss',
    ),
  )
  @Validate(IsFutureDate)
  date: string;

  @Validate(IsValidDateFormat)
  @IsNotEmpty()
  @Transform(({ value, obj }: TransformFnParams) =>
    TimezoneAdapter.convertToSystemTimezone(value, obj.timezone).format(
      'YYYY-MM-DD HH:mm:ss',
    ),
  )
  @Validate(IsAfterStartDate)
  startInscriptionDate: string;

  @Validate(IsValidDateFormat)
  @IsNotEmpty()
  @Transform(({ value, obj }: TransformFnParams) =>
    TimezoneAdapter.convertToSystemTimezone(value, obj.timezone).format(
      'YYYY-MM-DD HH:mm:ss',
    ),
  )
  @Validate(IsAfterEndDate)
  endInscriptionDate: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  maxParticipants: number;

  @IsUrl()
  @IsNotEmpty()
  graphicURL: string;
}
