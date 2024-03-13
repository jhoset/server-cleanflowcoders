import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isValidDateFormat', async: false })
export class IsValidDateFormat implements ValidatorConstraintInterface {
  validate(date: string, args: ValidationArguments) {
    return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(date);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be in the format 'Y-m-d H:i:s'`;
  }
}