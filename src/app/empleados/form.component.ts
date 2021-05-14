import { Component, OnInit } from '@angular/core';
import { Empleado } from './empleado';
import { EmpleadoService } from './empleado.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public empleado: Empleado = new Empleado();
  titulo: string = "Crear Cliente";

  errores: string[];

  constructor(public empleadoService: EmpleadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = +params.get('id');
      if (id) {
        this.empleadoService.getEmpleado(id).subscribe((empleado) => this.empleado = empleado);
      }
    });
  }

  create(): void {
    console.log(this.empleado);
    this.empleadoService.create(this.empleado).subscribe(
        empleado => {
          this.router.navigate(['/empleados']);
          swal.fire('Nuevo cliente', `El cliente ${empleado.nombre} ha sido creado con éxito`, 'success');
        },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        }
    );
  }

  update(): void {
    console.log(this.empleado);
    this.empleadoService.update(this.empleado).subscribe(
        json => {
          this.empleado = json.empleado;
          console.log(json.empleado);
          sessionStorage.setItem("Empleado actualizado", JSON.stringify(this.empleado));
          this.router.navigate(['/empleados']);
          swal.fire('Cliente Actualizado', `${json.mensaje}: ${json.empleado.nombre}`, 'success');
        },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        }
      )
  }
}
