import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReedEventoAdminComponent } from './reedeventoadmin.component';
import { reedeventoadminRoutes } from './reedeventoadmin.routes';
;

const routes: Routes = [
    {
        path: '',
        component: ReedEventoAdminComponent,
        children: reedeventoadminRoutes,
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
export class ReedEventoAdminRoutingModule { }
