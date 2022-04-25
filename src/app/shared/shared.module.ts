import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import {MenubarModule} from 'primeng/menubar';

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
        MenuBarComponent
    ],
    exports: [
        NavBarComponent,
        MenuBarComponent
    ]
})
export class SharedModule { }
