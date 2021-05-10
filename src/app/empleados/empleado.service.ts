import { Injectable } from '@angular/core';
import { Empleado } from './empleado';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { Router } from '@angular/router';

@Injectable()
export class EmpleadoService {
  private urlEndPoint: string = 'http://localhost:8080/api/empleados';

  constructor(private http: HttpClient, private router: Router) { }

  getEmpleados(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('ClienteService: tap 1');
        (response.content as Empleado[]).forEach(empleado => console.log(empleado.nombre));
      }),
      map((response: any) => {
        (response.content as Empleado[]).map(empleado => {
          empleado.nombre = empleado.nombre.toUpperCase();
          return empleado;
        });
        return response;
      }),
      tap(response => {
        console.log('ClienteService: tap 2');
        (response.content as Empleado[]).forEach(empleado => console.log(empleado.nombre));
      }));
  }

  create(empleado: Empleado): Observable<Empleado> {
    return this.http.post(this.urlEndPoint, empleado)
      .pipe(
        map((response: any) => response.empleado as Empleado),
        catchError(e => {
          if (e.status == 400) {
            return throwError(e);
          }
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        }));
  }

  getEmpleado(id): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/empleados']);
          console.error(e.error.mensaje);
        }

        return throwError(e);
      }));
  }

  update(empleado: Empleado): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${empleado.id}`, empleado).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }

  delete(id: number): Observable<Empleado> {
    return this.http.delete<Empleado>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }
}
