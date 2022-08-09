import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ReedEventoAdminRoutingModule } from './reedeventoadmin-routing.module';

//MODULOS PERZONALIZADOS
import { SharedModule } from 'src/app/shared/shared.module';

import { ConfirmationService } from 'primeng/api';
import { ReedEventoAdminComponent } from './reedeventoadmin.component';
import { HomeComponent } from './home/home.component';

import { ToastModule } from 'primeng/toast';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ReedEventoAdminRoutingModule,
        SharedModule,
        //PrimeNG
        ToastModule
    ],
    providers: [ConfirmationService],
    declarations: [
        ReedEventoAdminComponent,
        HomeComponent,
    ]
})
export class ReedEventoAdminModule { }
