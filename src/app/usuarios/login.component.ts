import { Component, OnInit } from '@angular/core';
import { Usuario } from "./usuario";
import { AuthService } from './auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: Usuario;

  errores: string[];

  constructor(
    private authService: AuthService,
    private router:Router
  ) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      Swal.fire('Login', `Hola ${this.authService.usuario.username} ya estás autenticado`, 'info');
      this.router.navigate(['/empleados/page/0']);
    }
  }

  cerrarSesion():void{
    localStorage.removeItem('usuariologueado');
  }
  login():void{
    if(this.usuario.username == null || this.usuario.password == null){
      Swal.fire('Error Login', '¡Dasatos o password vacías!', 'error');
      return;
    }
    this.authService.login(this.usuario).subscribe(
      response=>{

        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);
        let usuario = this.authService.usuario;
        this.router.navigate(['/empleados/page/0']);
        Swal.fire('Login', `Bienvenido ${usuario.username}, has iniciado sesión con éxito`, 'success');
      },
      err=>{
        if(err.status == 400 || err.status == 401){
          Swal.fire('Error Login', '¡Usuario o clave incorrectas!', 'error');
        }
      }
    );
  }
}
