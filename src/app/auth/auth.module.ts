import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { LoginAdminComponent } from './admin/login-admin/login-admin.component';
import { LoginUserComponent } from './user/login-user/login-user.component';
import { RegistroUserComponent } from './user/registro-user/registro-user.component';

@NgModule({
  declarations: [
    LoginAdminComponent,
    LoginUserComponent,
    RegistroUserComponent
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
