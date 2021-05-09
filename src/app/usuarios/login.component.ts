import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo: string = 'Iniciar sesison';
  usuario: Usuario;

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
        swal.fire('Login', `${this.authService.usuario.username} ya estas autenticado`, 'info');
      this.router.navigate(['/empleados']);
    }
  }

  login():void {
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null){
      swal.fire('Error Login', 'Usuario o clave vacias', 'error');
      return;
    }

    this.authService.login(this.usuario).subscribe(
      response => {
       this.authService.guardarUsuario(response.access_token);
       this.authService.guardarToken(response.access_token);
       let usuario = this.authService.usuario;
       this.router.navigate(['/empleados']);
       swal.fire('Login', `Bienvenido ${usuario.username}, has iniciado sesion con éxito`, 'success');
     },
     err => {
      if(err.status == 400 || err.status == 401){
        swal.fire('Error Login', 'Usuario o clave incorrecta', 'error');
      }
    }
  )
  }

}
