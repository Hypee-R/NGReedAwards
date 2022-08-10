import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { LoginAdminComponent } from './admin/login-admin/login-admin.component';
import { LoginAdminEventoComponent } from './adminEvento/login-admin/login-admin.component';
import { LoginUserComponent } from './user/login-user/login-user.component';
import { LoginUserEventoComponent } from './userEvento/login-user/login-user.component';
import { RegistroUserComponent } from './user/registro-user/registro-user.component';
import { RegistroUserEventoComponent } from './userEvento/registro-user/registro-user.component';
import { RegistroAdminComponent } from './admin/registro-admin/registro-admin.component';
import { RecuperarPasswordComponent } from './user/recuperar-password/recuperar-password.component';
import { RecuperarPasswordEventoComponent } from './userEvento/recuperar-password/recuperar-password.component';
import { SharedModule } from '../shared/shared.module';
import { VerificarCorreoComponent } from './user/verificar-correo/verificar-correo.component';

@NgModule({
  declarations: [
    LoginAdminComponent,
    LoginAdminEventoComponent,
    LoginUserComponent,
    LoginUserEventoComponent,
    RegistroUserComponent,
    RegistroUserEventoComponent,
    RegistroAdminComponent,
    RecuperarPasswordComponent,
    RecuperarPasswordEventoComponent,
    VerificarCorreoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    ToastModule
  ]
})
export class AuthModule { }
