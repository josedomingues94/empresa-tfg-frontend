import { Injectable } from '@angular/core';
import { Oficina } from './oficina';
import { HttpClient, HttpRequest, HttpEvent} from '@angular/common/http';
import { map, catchError, tap} from 'rxjs/operators';
import { Observable, throwError} from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class OficinaService {

  private urlEndPoint: string = 'http://localhost:8080/api/oficinas';

  constructor(private http: HttpClient, private router: Router) { }

  getOficinas(page: number): Observable<any>{
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        (response.content as Oficina[]).forEach(oficina => oficina.nombre);
      }),
      map((response: any) =>{
        (response.content as Oficina[]).map(oficina => {
          oficina.nombre = oficina.nombre.toUpperCase();
          oficina.provincia = oficina.provincia.toUpperCase();
          oficina.ciudad = oficina.ciudad.toUpperCase();
          return oficina;
        });
        return response;
      })
    )
  }

  create(oficina: Oficina): Observable<Oficina> {
    return this.http.post(this.urlEndPoint, oficina).pipe(
      map((response: any) => response.oficina as Oficina),
      catchError(e => {
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

  getOficina(id): Observable<Oficina> {
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
