import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ReedEventoRoutingModule } from './reedevento-routing.module';
//MODULOS PERZONALIZADOS
import { SharedModule } from 'src/app/shared/shared.module';

import { ConfirmationService } from 'primeng/api';
import { ReedEventoComponent } from './reedevento.component';
import { HomeComponent } from './home/home.component';

import { ContactoComponent } from './contacto/contacto.component';
import { MisLugaresComponent } from './mis-lugares/mis-lugares.component';
import { MiInformacionComponent } from './mi-informacion/mi-informacion.component';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from "primeng/panel";
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { PagoComponent } from './home/pago/pago.component';
import { SidebarModule } from 'primeng/sidebar';
import { DialogModule } from 'primeng/dialog';
//QR
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ReedEventoRoutingModule,
        SharedModule,   
        //PrimeNG
        ToastModule,
        TableModule,
        ToolbarModule,
        ButtonModule,
        PanelModule,
        CardModule,
        TooltipModule,
        SidebarModule,
        DialogModule,
        QRCodeModule,
       
    ],
    providers: [ConfirmationService],
    declarations: [
        ReedEventoComponent,
        HomeComponent,
        MiInformacionComponent,
        MisLugaresComponent,
        ContactoComponent,
        PagoComponent
       
    ]
})
export class ReedEventoModule { }
