import { BadRequestException } from '@nestjs/common';

export class RaffleException extends BadRequestException {
  constructor(message: string, code: string) {
    super({ message, code });
  }
}
