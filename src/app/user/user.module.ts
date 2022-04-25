import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

//MODULOS PERZONALIZADOS
import { AuthModule } from '../auth/auth.module';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from './user.component';
//PrimeNG
import { ToastModule } from 'primeng/toast';
import { CategoriasComponent } from './categorias/categorias.component';
import { NominacionesComponent } from './nominaciones/nominaciones.component';
import { ContactoComponent } from './contacto/contacto.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AuthModule,
        UserRoutingModule,
        SharedModule,
        //PrimeNG
        ToastModule
    ],
    declarations: [
        UserComponent,
        CategoriasComponent,
        NominacionesComponent,
        ContactoComponent
    ]
})
export class UserModule { }
