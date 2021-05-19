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

  constructor(private oficinaService: OficinaService,
  public authService: AuthService,
  private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let pagina: number = +params.get('page');

      if(!pagina){
        pagina = 0;
      }
      this.oficinaService.getOficinas(pagina).subscribe(
        response => {
          this.oficinas = response.content as Oficina[];
          this.paginador = response;
        }
      );
    });
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



}
