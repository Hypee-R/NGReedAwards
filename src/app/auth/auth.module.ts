import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { LoginAdminComponent } from './admin/login-admin/login-admin.component';
import { LoginUserComponent } from './user/login-user/login-user.component';
import { RegistroUserComponent } from './user/registro-user/registro-user.component';
import { RegistroAdminComponent } from './admin/registro-admin/registro-admin.component';

@NgModule({
  declarations: [
    LoginAdminComponent,
    LoginUserComponent,
    RegistroUserComponent,
    RegistroAdminComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ToastModule
  ]
})
export class AuthModule { }
