import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { LoginUserComponent } from './user/login-user/login-user.component';
import { RegistroUserComponent } from './user/registro-user/registro-user.component';
import { RecuperarPasswordComponent } from './user/recuperar-password/recuperar-password.component';
import { SharedModule } from '../shared/shared.module';
import { VerificarCorreoComponent } from './user/verificar-correo/verificar-correo.component';

@NgModule({
  declarations: [
    LoginUserComponent,
    RegistroUserComponent,
    RecuperarPasswordComponent,

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
