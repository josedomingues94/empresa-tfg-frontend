import { Component, OnInit } from '@angular/core';
import { Empleado } from './empleado';
import { EmpleadoService } from './empleado.service';
import { ModalService } from './perfil/modal.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import { Oficina } from '../oficinas/oficina';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html'
})
export class EmpleadosComponent implements OnInit {

  empleados: Empleado[];
  paginador: any;
  nombre: string;
  apellido1: string;
  apellido2: string;
  email: string;
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

      this.empleadoService.getEmpleados(this.nombre, this.apellido1, this.apellido2, this.email, page)
        .subscribe(response => {
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
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger mr-3'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${empleado.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Dar de baja',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.empleadoService.delete(empleado.id).subscribe(
          () => {
            this.empleados = this.empleados.filter(emp => emp !== empleado)
            swalWithBootstrapButtons.fire(
              'Cliente Eliminado!',
              `Cliente ${empleado.nombre} eliminado con éxito.`,
              'success'
            )
          }
        )
      }
    });
  }

  abrirModal(empleado: Empleado) {
    this.empleadoSeleccionado = empleado;
    this.modalService.abrirModal();
  }

  buscarEmpleados() {
    this.activatedRoute.paramMap.subscribe(params => {
      let pagina: number = +params.get('page');
      if (!pagina) {
        pagina = 0;
      }
      if(this.nombre == ""){
        this.nombre = undefined;
      }
      if(this.apellido1 == ""){
        this.apellido1 = undefined;
      }
      if(this.apellido2 == ""){
        this.apellido2 = undefined;
      }
      if(this.email == ""){
        this.email = undefined;
      }
      this.empleadoService.getEmpleados(this.nombre, this.apellido1, this.apellido2, this.email, pagina).pipe(
        tap(response => {
          this.empleados = response.content;
          this.empleados.forEach(empleado => {
            this.empleadoService.getEmpleado(empleado.id).subscribe(
              empleadoFiltrado => empleado = empleadoFiltrado
            )
          })
          this.paginador = response;
        })

      ).subscribe();
    })
  }

  limpiar() {
    this.nombre = undefined;
    this.apellido1 = undefined;
    this.apellido2 = undefined;
    this.email = undefined;
  }

}
