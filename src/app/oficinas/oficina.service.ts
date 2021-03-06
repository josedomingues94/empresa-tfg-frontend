import { Injectable } from '@angular/core';
import { Oficina } from './oficina';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders, HttpParams} from '@angular/common/http';
import { map, catchError, tap} from 'rxjs/operators';
import { Observable, throwError} from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class OficinaService {

  private urlEndPoint: string = 'http://localhost:8080/api/oficinas';

  constructor(private http: HttpClient, private router: Router) { }

  getOficinas(nombre: string, ciudad: string, provincia: string, page: number): Observable<any> {
    let params = new HttpParams().set("nombre", nombre).set("ciudad", ciudad).set("provincia", provincia);
    return this.http.get(`${this.urlEndPoint}/page/${page}`, {params:params}).pipe(
      map((response: any) => {
        (response.content as Oficina[]).map(oficina => {
          oficina.nombre = oficina.nombre.toUpperCase();
          oficina.ciudad = oficina.ciudad.toUpperCase();
          oficina.provincia = oficina.provincia.toUpperCase();
          return oficina;
        });
        return response;
      })
      );
  }

  obtnenerOficina(id: number): Observable<Oficina> {
    return this.http.get<Oficina>(`${this.urlEndPoint}/${id}`).pipe(
        catchError(e => {
          console.error(e.error.mensaje);
          this.router.navigate(['/empleados'])
          Swal.fire('Error al editar', e.error.mensaje, 'error')
          return throwError(e);
        })
      );
  }

  create(oficina: Oficina): Observable<Oficina> {
    return this.http.post(this.urlEndPoint, oficina).pipe(
      map((response: any) => response.oficina as Oficina),
      catchError(e => {
        if(e.status == 400){
          return throwError(e);
        }
        if(e.error.mensaje){
          Swal.fire('Error al crear el vehículo', e.error.mensaje ,'error');
          console.log(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  getOficina(id: number): Observable<Oficina> {
    return this.http.get<Oficina>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if(e.status != 401 && e.error.mensaje){
          this.router.navigate(['/oficinas']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      }));
  }

  update(oficina: Oficina): Observable<any> {
  return this.http.put<any>(`${this.urlEndPoint}/${oficina.id}`, oficina).pipe(
    catchError(e => {
      if(e.status == 400){
        throwError(e);
      }
      if(e.error.mensaje){
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
      }
      return throwError(e);
    }));
  }

  delete(id: number): Observable<Oficina> {
    return this.http.delete<Oficina>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    )
  }

}
