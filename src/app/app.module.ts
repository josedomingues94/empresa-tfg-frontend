import { NgModule } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from './usuarios/guard/auth.guard';
import { RoleGuard } from './usuarios/guard/role.guard';
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { EmpleadoService } from './empleados/empleado.service';
import { RouterModule, Routes} from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormComponent } from './empleados/form.component';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { LoginComponent } from './usuarios/login.component';
import { PerfilComponent } from './empleados/perfil/perfil.component';
import { PaginadorComponent } from './paginador/paginador.component';
import { OficinasComponent } from './oficinas/oficinas.component';
import { OficinaService } from './oficinas/oficina.service';
import { FormComponentOficina } from './oficinas/form.component.oficina';
import { PaginadorOficinasComponent } from './paginador-oficinas/paginador-oficinas.component';
import { ChatComponent } from './chat/chat.component';
import { UsuarioPerfilComponent } from './usuarios/usuario.perfil.component';





const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'perfil', component: UsuarioPerfilComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_USER'} },
  {path: 'empleados', component: EmpleadosComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_USER'} },
  {path: 'empleados/page/:page', component: EmpleadosComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_USER'} },
  {path: 'empleados/form', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'} },
  {path: 'empleados/form/:id', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'} },
  {path: 'oficinas', component: OficinasComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_USER'} },
  {path: 'oficinas/page/:page', component: OficinasComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_USER'} },
  {path: 'oficinas/form', component: FormComponentOficina, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'} },
  {path: 'oficinas/form/:id', component: FormComponentOficina, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'} },
  {path: 'chat', component: ChatComponent }


];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    EmpleadosComponent,
    FormComponent,
    FormComponentOficina,
    LoginComponent,
    PaginadorComponent,
    PerfilComponent,
    OficinasComponent,
    PaginadorOficinasComponent,
    ChatComponent,
    UsuarioPerfilComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule, ReactiveFormsModule
  ],
  providers: [
    EmpleadoService,
    OficinaService,
    FormComponent,
    FormComponentOficina,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
