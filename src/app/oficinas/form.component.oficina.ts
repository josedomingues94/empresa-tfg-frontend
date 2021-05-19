import { Component, OnInit } from '@angular/core';
import { Oficina } from './oficina';
import { OficinaService } from './oficina.service';
import { Router,ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.oficina.html',
  styleUrls: ['./form.component.oficina.css']
})
export class FormComponentOficina implements OnInit {

  public oficina: Oficina = new Oficina();
  titulo: string = "Crear Oficina";
  errores: string[];

  constructor(public oficinaService: OficinaService,
  private router: Router,
  private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = +params.get('id');
      if(id){
        this.oficinaService.getOficina(id).subscribe(
          (oficina) => this.oficina = oficina);
      }
    });
  }

  create(): void {
    this.oficinaService.create(this.oficina).subscribe(
      oficina => {
        this.router.navigate(['/oficinas']);
        swal.fire('Nueva oficina', `La oficina ${oficina.nombre} ha sido creada con exito`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    )
  }

  update(): void {
    this.oficinaService.update(this.oficina).subscribe(
      oficinaActualizada => {
        this.oficina = oficinaActualizada.oficina;
        sessionStorage.setItem("Oficina actualizada", JSON.stringify(this.oficina));
        this.router.navigate(['/oficinas']);
        swal.fire('Oficina actualizada', `${oficinaActualizada.mensaje}: ${oficinaActualizada.oficina.nombre}`, 'success');
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    )
  }

}
