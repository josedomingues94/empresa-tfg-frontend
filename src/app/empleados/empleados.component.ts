import { Component, OnInit } from '@angular/core';
import { Empleado } from './empleado';
import { EmpleadoService } from './empleado.service';
import { ModalService } from './perfil/modal.service';
import { AuthService } from '../usuarios/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html'
})
export class EmpleadosComponent implements OnInit {

  empleados: Empleado[];
  empleadoSeleccionado: Empleado;

  constructor(private empleadoService: EmpleadoService, public authService: AuthService,
  private moadalService: ModalService) { }

  ngOnInit() {
    this.empleadoService.getEmpleados().subscribe(
      empleados => this.empleados = empleados
    );
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
      text: `Dando de baja al empleado ${empleado.nombre}, esta acción no se puede deshacer`,
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
                `El empleado ${empleado.nombre} fue dado de baja con exíto!`,
                'success'
              )
          }

        );


      } else if (
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

  abrirModal(empleado: Empleado){
    this.empleadoSeleccionado = empleado;
    this.moadalService.abrirModal();
  }

}
