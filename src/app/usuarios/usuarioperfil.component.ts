import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import { Router } from '@angular/router';
import { UsuarioService } from './usuario.service';
import { UsuarioPerfil } from './usuarioperfil';



@Component({
  selector: 'app-usuarioperfil',
  templateUrl: './usuarioperfil.component.html',
  styleUrls: ['./usuarioperfil.component.css']
})
export class UsuarioperfilComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
