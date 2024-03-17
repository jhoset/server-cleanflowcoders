import { RaffleException } from './raffle.exception';
import { RafflesErrorCodes } from '../constants/raffle-error.constan';

export class RaffleAlreadyPlayedException extends RaffleException {
  constructor() {
    super(
      RafflesErrorCodes.RaffleAlreadyPlayed.message,
      RafflesErrorCodes.RaffleAlreadyPlayed.code,
    );
  }
}
