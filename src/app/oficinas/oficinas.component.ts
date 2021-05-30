import { Component, OnInit } from '@angular/core';
import { Oficina } from './oficina';
import { OficinaService } from './oficina.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-oficinas',
  templateUrl: './oficinas.component.html',
  styleUrls: ['./oficinas.component.css']
})
export class OficinasComponent implements OnInit {

  oficinas: Oficina[];
  paginador: any;
  nombre: string;
  ciudad: string;
  provincia: string;

  constructor(private oficinaService: OficinaService,
  public authService: AuthService,
  private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let pagina: number = +params.get('pagina');
      if (!pagina) {
        pagina = 0;
      }
      this.oficinaService.buscardorOficinas(this.nombre, this.ciudad, this.provincia, pagina)
      .subscribe(response => {
        this.oficinas = response.content as Oficina[];
        this.paginador = response;
      });
    })
  }

  delete(oficina: Oficina): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger mr-3'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${oficina.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Dar de baja',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.oficinaService.delete(oficina.id).subscribe(
          () => {
            this.oficinas = this.oficinas.filter(ofi => ofi !== oficina)
            swalWithBootstrapButtons.fire(
              'Cliente Eliminado!',
              `Cliente ${oficina.nombre} eliminado con éxito.`,
              'success'
            )
          }
        )
      }
    });
  }

  buscarOficinas() {
    this.activatedRoute.paramMap.subscribe(params => {
      let pagina: number = +params.get('page');
      if (!pagina) {
        pagina = 0;
      }
      if(this.nombre == ""){
        this.nombre = undefined;
      }
      if(this.ciudad == ""){
        this.ciudad = undefined;
      }
      if(this.provincia == ""){
        this.provincia = undefined;
      }
      this.oficinaService.buscardorOficinas(this.nombre, this.ciudad, this.provincia, pagina).pipe(
        tap(response => {
          this.oficinas = response.content;
          this.oficinas.forEach(oficina => {
            this.oficinaService.obtnenerOficina(oficina.id).subscribe(
              oficinaFiltrada => oficina = oficinaFiltrada
            )
          })
          this.paginador = response;
        })

      ).subscribe();
    })
  }

  limpiar() {
    this.nombre = undefined;
    this.ciudad = undefined;
    this.provincia = undefined;
  }
}
