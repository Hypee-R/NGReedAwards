import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { reedeventoRoutes } from './reedevento.routes';
import { ReedEventoComponent } from './reedevento.component';
;

const routes: Routes = [
    {
        path: '',
        component: ReedEventoComponent,
        children: reedeventoRoutes,
    }
];

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [
        RouterModule,
    ],
})
export class ReedEventoRoutingModule { }
