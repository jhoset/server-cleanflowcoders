export const RafflesErrorCodes = {
  RaffleRegistrationPeriod: {
    code: 'RAFFLE_REGISTRATION_PERIOD',
    message: 'The registration period for this raffle has ended.',
  },
  RaffleMaxParticipants: {
    code: 'RAFFLE_MAX_PARTICIPANTS',
    message: 'Maximum participants for this raffle has been reached.',
  },
  DiscordUserNotFound: {
    code: 'DISCORD_USER_NOT_FOUND',
    message: 'User not found in the Discord server.',
  },
  AlreadyParticipating: {
    code: 'ALREADY_PARTICIPATING',
    message: 'You are already participating in this raffle.',
  },
  RaffleAlreadyPlayed: {
    code: 'RAFFLE_ALREADY_PLAYED',
    message: 'You cannot play this raffle because it has already been played.',
  },
  RaffleDateNotReached: {
    code: 'RAFFLE_DATE_NOT_REACHED',
    message:
      'You cannot play this raffle because the raffle date has not yet been reached.',
  },
};
