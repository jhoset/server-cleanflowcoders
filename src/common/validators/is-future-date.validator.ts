import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isFutureDate', async: false })
export class IsFutureDate implements ValidatorConstraintInterface {
  validate(date: string, args: ValidationArguments) {
    const inputDate = new Date(date);
    const currentDate = new Date();
    return inputDate > currentDate;
  }

  defaultMessage(args: ValidationArguments) {
    return 'The date must be in the future.';
  }
}
