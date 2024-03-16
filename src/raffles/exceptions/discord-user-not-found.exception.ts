import { RaffleException } from './raffle.exception';
import { RafflesErrorCodes } from '../constants/raffle-error.constan';

export class DiscordUserNotFoundException extends RaffleException {
  constructor() {
    super(
      RafflesErrorCodes.DiscordUserNotFound.message,
      RafflesErrorCodes.DiscordUserNotFound.code,
    );
  }
}
