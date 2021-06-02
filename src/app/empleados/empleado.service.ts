import { Injectable } from '@angular/core';
import { Empleado } from './empleado';
import { HttpClient, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Oficina } from '../oficinas/oficina'
import { OficinaService } from '../oficinas/oficina.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private urlEndPoint: string = 'http://localhost:8080/api/empleados';

  oficina: number;

  constructor(
    private http: HttpClient,
    private router: Router,
    private oficinaService: OficinaService
  ) { }

  getOficinas(): Observable<Oficina[]> {
      return this.http.get<Oficina[]>(this.urlEndPoint + '/oficinas');
    }


  getEmpleados(nombre: string, apellido1: string, apellido2: string, email: string, page: number): Observable<any> {
    let params = new HttpParams().set("nombre", nombre).set("apellido1", apellido1).set("apellido2", apellido2).set("email", email);
    return this.http.get(`${this.urlEndPoint}/page/${page}`, {params:params}).pipe(
      map((response: any) => {
        (response.content as Empleado[]).map(empleado => {
          empleado.nombre = empleado.nombre.toUpperCase();
          empleado.apellido1 = empleado.apellido1.toUpperCase();
          empleado.apellido2 = empleado.apellido2.toUpperCase();
          return empleado;
        });
        return response;
      })
      );
  }

  create(empleado: Empleado): Observable<Empleado> {
    this.oficinaService.getOficina(this.oficina);
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
        if (e.status == 400) {
        this.router.navigate(['/empleados']);
        }
        console.error(e.error.mensaje);
        return throwError(e);
      })
    );
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
