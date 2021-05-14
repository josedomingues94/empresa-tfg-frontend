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



const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'empleados', component: EmpleadosComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_USER'} },
  {path: 'empleados/page/:page', component: EmpleadosComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_USER'} },
  {path: 'empleados/form', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'} },
  {path: 'empleados/form/:id', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'} }


];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    EmpleadosComponent,
    FormComponent,
    LoginComponent,
    PaginadorComponent,
    PerfilComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule, ReactiveFormsModule
  ],
  providers: [EmpleadoService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
