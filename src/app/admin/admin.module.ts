import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

//MODULOS PERZONALIZADOS
import { AuthModule } from '../auth/auth.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { ToastModule } from 'primeng/toast';
import { HomeComponent } from './home/home.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { ConvocatoriasComponent } from './convocatorias/convocatorias.component';
import { JuecesComponent } from './jueces/jueces.component';
import { NominacionesComponent } from './nominaciones/nominaciones.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { EvaluacionNominacionesComponent } from './evaluacion-nominaciones/evaluacion-nominaciones.component';
import { MensajesContactoComponent } from './mensajes-contacto/mensajes-contacto.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AuthModule,
        AdminRoutingModule,
        SharedModule,
        //PrimeNG
        ToastModule
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
        MensajesContactoComponent
    ]
})
export class AdminModule { }
