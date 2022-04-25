import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

//MODULOS PERZONALIZADOS
import { AuthModule } from '../auth/auth.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { ToastModule } from 'primeng/toast';

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
        AdminComponent
    ]
})
export class AdminModule { }
