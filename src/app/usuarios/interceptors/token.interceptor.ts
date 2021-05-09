import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService){}


intercept(req: HttpRequest <any>, next: HttpHandler): Observable<HttpEvent<any>>{
  let token = this.authService.token;
  if(token != null){
    const authReq = req.clone({
        headers: req.headers.set('Authorization', 'Barer' + token)
      });
      return next.handle(authReq);
  }
  return next.handle(req);
}

}
