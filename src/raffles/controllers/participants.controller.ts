import { Controller } from '@nestjs/common';

@Controller({
  path: 'participants',
  version: '1',
})
export class ParticipantsController {
  constructor() {}
}
