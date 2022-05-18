import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

//MODULOS PERZONALIZADOS
import { AuthModule } from '../auth/auth.module';
import { AdminRoutingModule } from './admin-routing.module';

import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CategoriasComponent } from './categorias/categorias.component';
import { ConvocatoriasComponent } from './convocatorias/convocatorias.component';
import { JuecesComponent } from './jueces/jueces.component';
import { NominacionesComponent } from './nominaciones/nominaciones.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { EvaluacionNominacionesComponent } from './evaluacion-nominaciones/evaluacion-nominaciones.component';
import { MensajesContactoComponent } from './mensajes-contacto/mensajes-contacto.component';

//PrimeNG
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import {SplitButtonModule} from 'primeng/splitbutton';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

import { AddNominacionAdminComponent } from './nominaciones/add-nominacion/add-nominacion.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AuthModule,
        AdminRoutingModule,
        SharedModule,
        //PrimeNG
        ToastModule,
        CardModule,
        DropdownModule,
        SplitButtonModule,
        SidebarModule,
        TableModule,
        ButtonModule,
        InputTextModule
    ],
    declarations: [
        AdminComponent,
        HomeComponent,
        CategoriasComponent,
        ConvocatoriasComponent,
        JuecesComponent,
        NominacionesComponent,
        UsuariosComponent,
        EvaluacionNominacionesComponent,
        MensajesContactoComponent,
        AddNominacionAdminComponent,
    ]
})
export class AdminModule { }
