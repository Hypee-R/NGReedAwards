import { Routes } from '@angular/router';
import { NotFoundComponent } from '../not-found/not-found.component';
import { LoginAdminComponent } from '../auth/admin/login-admin/login-admin.component';
export const adminRoutes: Routes = [
    //{ path: 'login', component: LoginAdminComponent },
    // { path: 'not-found', component: NotFoundComponent },
    { path: '**', redirectTo: 'not-found' }
];
