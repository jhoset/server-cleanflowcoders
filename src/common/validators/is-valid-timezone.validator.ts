import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { TimezoneAdapter } from '../adapters';
@ValidatorConstraint({ name: 'isValidTimezone', async: false })
export class IsValidTimezone implements ValidatorConstraintInterface {
  validate(timezone: string, args: ValidationArguments) {
    return TimezoneAdapter.isValidTimezone(timezone);
  }

  defaultMessage(args: ValidationArguments) {
    return 'The timezone provided is not valid.';
  }
}
