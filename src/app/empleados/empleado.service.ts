import { Injectable } from '@angular/core';
import { Empleado } from './empleado';
import { HttpClient, HttpRequest,HttpHeaders, HttpEvent, HttpParams } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Oficina } from '../oficinas/oficina';


@Injectable()
export class EmpleadoService {
  private urlEndPoint: string = 'http://localhost:8080/api/empleados';
  private httpHeaders=new HttpHeaders({'Content-Type':'application/json'});

  constructor(private http: HttpClient, private router: Router) { }

  getEmpleados(nombre: string, apellido1: string, apellido2: string, page: number): Observable<any> {
    let params = new HttpParams().set("nombre", nombre).set("apellido1", apellido1).set("apellido2", apellido2);
    return this.http.get(`${this.urlEndPoint}/page/${page}`, {params:params}).pipe(
      tap((response: any) => {
        (response.content as Empleado[]).forEach(empleado => console.log(empleado.nombre));
      }),
      map((response: any) => {
        (response.content as Empleado[]).map(empleado => {
          empleado.nombre = empleado.nombre.toUpperCase();
          empleado.apellido1 = empleado.apellido1.toUpperCase();
          empleado.apellido2 = empleado.apellido2.toUpperCase();
          return empleado;
        });
        return response;
      }),
      tap(response => {
        (response.content as Empleado[]).forEach(empleado => console.log(empleado.nombre));
      }));
  }

  obtnenerEmpleado(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        console.error(e.error.mensaje);
        return throwError(e);
      })
    );
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

  getEmpleado(id: number): Observable<any> {
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
