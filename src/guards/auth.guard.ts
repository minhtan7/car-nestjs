import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";


export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()

    //if there is userId, return that id
    //if not, a falsy value will stop the app to execute
    return request.session.userId
  }
}