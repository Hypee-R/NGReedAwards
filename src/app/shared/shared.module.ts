import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { NavBarEventoComponent } from './components/nav-bar-evento/nav-bar-evento.component';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import {MenubarModule} from 'primeng/menubar';
import { SafeurlPipe } from './pipes/url-sanitazer.pipe';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        //PrimeNG
        MenubarModule,
    ],
    declarations: [
        NavBarComponent,
        MenuBarComponent,
        SpinnerComponent,
        NavBarEventoComponent,
        //Pipes
        SafeurlPipe,
    ],
    exports: [
        NavBarComponent,
        MenuBarComponent,
        SpinnerComponent,
        NavBarEventoComponent,
        SafeurlPipe,
        
    ]
})
export class SharedModule { }
