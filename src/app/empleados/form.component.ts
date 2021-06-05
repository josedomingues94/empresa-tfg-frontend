import { Component, OnInit } from '@angular/core';
import { Empleado } from './empleado';
import { EmpleadoService } from './empleado.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Oficina } from '../oficinas/oficina';
import { OficinaService } from '../oficinas/oficina.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public empleado: Empleado = new Empleado();
  titulo: string = "Crear Empleado";
  oficinas: Oficina[] = [];
  errores: string[];
  oficina: Oficina = new Oficina();

  constructor(
    public empleadoService: EmpleadoService,
    public oficinaService: OficinaService,

    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
        let id = +params.get('id');
        if (id) {
          this.cargarEmpleado();
        }
      });

      this.empleadoService.getOficinas().subscribe(oficinas => this.oficinas = oficinas);


    }

    create(): void {
      console.log(this.empleado);
      this.empleadoService.create(this.empleado)
        .subscribe(
          empleado => {
            console.log(this.empleado);
            console.log(this.oficinas);
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
      this.empleadoService.update(this.empleado)
        .subscribe(
          json => {
            this.router.navigate(['/empleados']);
            swal.fire('Empleado Actualizado', `${json.mensaje}: ${json.empleado.nombre}`, 'success');
          },
          err => {
            this.errores = err.error.errors as string[];
            console.error('Código del error desde el backend: ' + err.status);
            console.error(err.error.errors);
          }
        )
    }

    cargarEmpleado():void{
      this.activatedRoute.params.subscribe(params=>{
        let id=params['id'];
        if(id){
          this.empleadoService.getEmpleado(id).subscribe((empleado)=>{
            this.empleado.dni = empleado.dni;
            this.empleado.nombre = empleado.nombre;
            this.empleado.apellido1 = empleado.apellido1;
            this.empleado.apellido2 = empleado.apellido2;
            this.empleado.createAt = empleado.createAt;
            this.empleado.oficina = empleado.oficina;
            console.log(this.empleado);
          });
        }
      })
    }

    compararOficina(o1: Oficina, o2: Oficina): boolean {
      if (o1 === undefined && o2 === undefined) {
        return true;
      }

      return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
    }

  }
