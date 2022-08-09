import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from 'src/config/auth.guard';
import { LoginUserEventoComponent } from '../../auth/userEvento/login-user/login-user.component';
import { MisLugaresComponent} from './mis-lugares/mis-lugares.component';
import { MiInformacionComponent } from './mi-informacion/mi-informacion.component';

export const reedeventoRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'mis-lugares', component: MisLugaresComponent, canActivate: [AuthGuard] },
    { path: 'mi-informacion', component: MiInformacionComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginUserEventoComponent },
    { path: '**', redirectTo: 'home' }
];
