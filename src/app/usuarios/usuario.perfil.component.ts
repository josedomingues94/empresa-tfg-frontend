import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import { Usuario } from '../usuarios/usuario';

@Component({
  selector: 'app-perfil',
  templateUrl: './usuario.perfil.component.html',
  styleUrls: ['./usuario.perfil.component.css']
})
export class UsuarioPerfilComponent implements OnInit {

  usuarios: Usuario[] = [];
  id: number;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

}
