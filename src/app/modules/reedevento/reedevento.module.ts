import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ReedEventoRoutingModule } from './reedevento-routing.module';

//MODULOS PERZONALIZADOS
import { SharedModule } from 'src/app/shared/shared.module';

import { ConfirmationService } from 'primeng/api';
import { ReedEventoComponent } from './reedevento.component';
import { HomeComponent } from './home/home.component';

import { MisLugaresComponent } from './mis-lugares/mis-lugares.component';
import { MiInformacionComponent } from './mi-informacion/mi-informacion.component';
import { ToastModule } from 'primeng/toast';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ReedEventoRoutingModule,
        SharedModule,
        //PrimeNG
        ToastModule
    ],
    providers: [ConfirmationService],
    declarations: [
        ReedEventoComponent,
        HomeComponent,
        MiInformacionComponent,
        MisLugaresComponent,
    ]
})
export class ReedEventoModule { }
