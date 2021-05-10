import { Component, OnInit } from '@angular/core';
import { Empleado } from './empleado';
import { EmpleadoService } from './empleado.service';
import { ModalService } from './perfil/modal.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html'
})
export class EmpleadosComponent implements OnInit {

  empleados: Empleado[];
  paginador: any;
  empleadoSeleccionado: Empleado;

  constructor(private empleadoService: EmpleadoService,
    private modalService: ModalService,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');

      if (!page) {
        page = 0;
      }

      this.empleadoService.getEmpleados(page)
        .pipe(
          tap(response => {
            console.log('ClientesComponent: tap 3');
            (response.content as Empleado[]).forEach(empleado => console.log(empleado.nombre));
          })
        ).subscribe(response => {
          this.empleados = response.content as Empleado[];
          this.paginador = response;
        });
    });


    this.modalService.notificarUpload.subscribe(empleado => {
      this.empleados = this.empleados.map(empleadoOriginal => {
        if (empleado.id == empleadoOriginal.id) {
          empleadoOriginal.foto = empleado.foto;
        }
        return empleadoOriginal;
      })
    })
  }

  delete(empleado: Empleado): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger mr-3'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: '¿Está seguro?',
      text: `Dando de baja el vehiculo con matricula ${empleado.id} ${empleado.nombre}, esta acción no se puede deshacer`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Dar de baja',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.empleadoService.delete(empleado.id).subscribe(
          response => {
            this.ngOnInit();
            swalWithBootstrapButtons.fire(
              'Dado de baja',
              `El vehiculo con matricula ${empleado.id} fue dado de baja con exíto!`,
              'success'
            )
          }

        );


      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Cambio de estado no realizado',
          'error'
        )
      }
    })
  }




  abrirModal(empleado: Empleado) {
    this.empleadoSeleccionado = empleado;
    this.modalService.abrirModal();
  }

}
