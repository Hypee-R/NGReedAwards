import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { adminRoutes } from './admin.routes';
import { NotFoundComponent } from '../../not-found/not-found.component';
;

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: adminRoutes,
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
export class AdminRoutingModule { }
