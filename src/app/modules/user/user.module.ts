import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

//MODULOS PERZONALIZADOS
import { AuthModule } from '../../auth/auth.module';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { UserComponent } from './user.component';

//PrimeNG
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

import { CategoriasComponent } from './categorias/categorias.component';
import { NominacionesComponent } from './nominaciones/nominaciones.component';
import { ContactoComponent } from './contacto/contacto.component';
import { InicioComponent } from './inicio/inicio.component';
import { MiInformacionComponent } from './mi-informacion/mi-informacion.component';
import { MisNominacionesComponent } from './mis-nominaciones/mis-nominaciones.component';
import { AddNominacionComponent } from './mis-nominaciones/add-nominacion/add-nominacion.component';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AuthModule,
        UserRoutingModule,
        SharedModule,
        //PrimeNG
        ToastModule,
        CardModule,
        DropdownModule,
        SidebarModule,
        TableModule,
        ButtonModule,
        InputTextModule
    ],
    declarations: [
        UserComponent,
        CategoriasComponent,
        NominacionesComponent,
        ContactoComponent,
        InicioComponent,
        MiInformacionComponent,
        MisNominacionesComponent,
        AddNominacionComponent,
    ],
})
export class UserModule { }
