import { Injectable } from '@angular/core';
import { Empleado } from './empleado';
import { Observable, throwError } from 'rxjs';
import { HttpClient,HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class EmpleadoService {
  private urlEndPoint: string = 'http://localhost:8080/api/empleados';

  constructor(private http: HttpClient,
  private router: Router) { }

  getEmpleados(): Observable<Empleado[]> {
    return this.http.get(this.urlEndPoint).pipe(
      map(response => response as Empleado[])
    );
  }

  create(empleado: Empleado) : Observable<Empleado> {
    return this.http.post(this.urlEndPoint, empleado)
    .pipe(
      map((response: any) => response.empleado as Empleado),
      catchError(e => {
        if(e.status == 400){
          return throwError(e);
        }
        if (e.error.mensaje){
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  getEmpleado(id: number): Observable<Empleado>{
    return this.http.get<Empleado>(`${this.urlEndPoint}/${id}`).pipe(
      catchError( e => {
        if(e.status != 401  && e.error.mensaje ){
          this.router.navigate(['/empleados']);
          console.log(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  update(empleado: Empleado): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${empleado.id}`, empleado)
    .pipe(
      catchError( e => {
        if(e.status == 400){
          return throwError(e);
        }
        if(e.error.mensaje){
          console.log(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Empleado>{
    return this.http.delete<Empleado>(`${this.urlEndPoint}/${id}`)
    .pipe(
      catchError( e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id){
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData,
    {reportProgress: true});
    return this.http.request(req);


  }
}
