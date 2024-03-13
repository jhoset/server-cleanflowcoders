// timezone.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TimezoneAdapter } from '../adapters';

@Injectable()
export class TimezoneHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const timezoneHeader = req.headers['timezone'];

    if (!timezoneHeader) {
      throw new BadRequestException('Timezone header is missing');
    }
    if (!TimezoneAdapter.isValidTimezone(timezoneHeader)) {
      throw new BadRequestException('The timezone provided is not valid.');
    }

    // Puedes realizar más validaciones si es necesario
    return next.handle();
  }
}
