import { RaffleException } from './raffle.exception';
import { RafflesErrorCodes } from '../constants/raffle-error.constan';

export class AlreadyParticipatingException extends RaffleException {
  constructor() {
    super(
      RafflesErrorCodes.AlreadyParticipating.message,
      RafflesErrorCodes.AlreadyParticipating.code,
    );
  }
}
