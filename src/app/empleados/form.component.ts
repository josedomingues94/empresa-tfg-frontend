import { Component, OnInit } from '@angular/core';
import { Empleado } from './empleado';
import { EmpleadoService} from './empleado.service';
import {Router, ActivatedRoute} from '@angular/router'
import swal from 'sweetalert2'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  empleado: Empleado = new Empleado()
  titulo:string = "Crear Empleado"

  constructor(private empleadoService: EmpleadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarEmpleado()
  }

  cargarEmpleado(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.empleadoService.getEmpleado(id).subscribe((empleado) => this.empleado = empleado)
      }
    })
  }

  create(): void {
    this.empleadoService.create(this.empleado)
      .subscribe(empleado => {
        this.router.navigate(['/empleados'])
        swal.fire('Nuevo empleado', `Empleado ${empleado.nombre} creado con éxito!`, 'success');
      }
      );
  }

  update():void{
    this.empleadoService.update(this.empleado)
    .subscribe( empleado => {
      this.router.navigate(['/empleados'])
      swal.fire('Empleado Actualizado', `Empleado ${empleado.nombre} actualizado con éxito!`, 'success');
    }

    )
  }

}
