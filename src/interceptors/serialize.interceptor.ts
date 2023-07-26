import {
  UseInterceptors, NestInterceptor,
  ExecutionContext, CallHandler
} from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Observable, map } from "rxjs";
import { UserDto } from "src/users/dtos/user.dto";

interface ClassContructor {
  new(...args: any[]): {}
}

export function Serialize(dto: ClassContructor) {
  return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //run something before  a request is handle

    return next.handle().pipe(
      map((data: any) => {
        //run sth before response is sent out
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true
        })
      })
    )
  }
}