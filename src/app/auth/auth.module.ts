import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { LoginAdminEventoComponent } from './adminEvento/login-admin/login-admin.component';
import { LoginUserEventoComponent } from './userEvento/login-user/login-user.component';
import { RegistroUserEventoComponent } from './userEvento/registro-user/registro-user.component';
import { RecuperarPasswordEventoComponent } from './userEvento/recuperar-password/recuperar-password.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    LoginAdminEventoComponent,
    LoginUserEventoComponent,
    RegistroUserEventoComponent,
    RecuperarPasswordEventoComponent,
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
