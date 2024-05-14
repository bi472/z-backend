import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Type,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, T> {
    constructor(private readonly dtoClass: Type<T>) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
        map(data =>  this.transformToDto(data, this.dtoClass)),
    );
    }

    transformToDto<T, V>(obj: V, dtoClass: new () => T): T {
        return plainToInstance(dtoClass, obj, {
            enableImplicitConversion: true, // Включает неявное преобразование типов, если нужно
            excludeExtraneousValues: true // Игнорирует свойства не описанные в dtoClass
        });
    }
}
