import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router){}

intercept(req: HttpRequest <any>, next: HttpHandler): Observable<HttpEvent<any>>{

  return next.handle(req).pipe(
    catchError(e => {
      if(e.sataus == 401){
        if(this.authService.isAuthenticated()){
          this.authService.logout();
        }
        this.router.navigate(['/login'])
      }
      if(e.status == 403){
        swal.fire('Acceso denegado', `${this.authService.usuario.username} no tienes acceso a este recurso`, 'warning');
        this.router.navigate(['/empleados']);
      }
      return throwError(e);
    })
  );
}

}
