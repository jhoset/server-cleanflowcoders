import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class SetTimezoneHeaderRequest implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const timezone = request.headers['timezone']; // Obtener el valor de la cabecera timezone

    // Insertar la cabecera timezone en la solicitud actual
    request.body.timezone = timezone;

    return next.handle().pipe(
      tap(() => {
        // Realizar acciones después de manejar la solicitud, si es necesario
      }),
    );
  }
}
