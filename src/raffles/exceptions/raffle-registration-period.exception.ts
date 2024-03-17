import { RaffleException } from './raffle.exception';
import { RafflesErrorCodes } from '../constants/raffle-error.constan';

export class RaffleRegistrationPeriodException extends RaffleException {
  constructor() {
    super(
      RafflesErrorCodes.RaffleRegistrationPeriod.message,
      RafflesErrorCodes.RaffleRegistrationPeriod.code,
    );
  }
}
