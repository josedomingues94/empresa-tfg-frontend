import { Component, OnInit, Input } from '@angular/core';
import { Empleado } from '../empleado';
import { EmpleadoService } from '../empleado.service';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';

import swal from 'sweetalert2';

@Component({
  selector: 'perfil-empleado',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  @Input() empleado: Empleado;
  titulo: string = "Perfil empleado";
  private imagenSeleccionada: File;
  progreso: number = 0;

  constructor(private empleadoService: EmpleadoService,
  private moadalService: ModalService) { }

  ngOnInit(): void {
  }

  selecccionarFoto(event) {
    this.imagenSeleccionada = event.target.files[0];
    this.progreso = 0;
    if(this.imagenSeleccionada.type.indexOf('image') < 0){
      swal.fire('Error seleccionar imagen: ', 'El archivo debe ser del tipo imagen', 'error');
      this.imagenSeleccionada = null;
    }
  }

  subirFoto(){
    if(!this.imagenSeleccionada){
      swal.fire('Error de subida', 'Debe seleccionar una foto', 'error');
    }
    else{
      this.empleadoService.subirFoto(this.imagenSeleccionada, this.empleado.id)
      .subscribe(event => {
        if(event.type === HttpEventType.UploadProgress){
          this.progreso = Math.round((event.loaded / event.total) * 100);
        }
        else if(event.type === HttpEventType.Response){
          let response: any = event.body;
          this.empleado = response.empleado as Empleado;

          this.moadalService.notificarUpload.emit(this.empleado);
          swal.fire('La imagen se ha subido con exito', response.mensaje, 'success');
        }
      });
    }

  }

  cerrarModal(){
    this.moadalService.cerrarModal();
    this.selecccionarFoto = null;
    this.progreso = 0;
  }

}
