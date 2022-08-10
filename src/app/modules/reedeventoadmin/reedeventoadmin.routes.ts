import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from 'src/config/auth.guard';
import { MensajesContactoComponent } from './mensajes-contacto/mensajes-contacto.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { LoginAdminEventoComponent } from '../../auth/adminEvento/login-admin/login-admin.component';

export const reedeventoadminRoutes: Routes = [
    { path: 'login', component: LoginAdminEventoComponent },
    { path: 'home', component: HomeComponent },
    { path: 'mensajes-contacto', component: MensajesContactoComponent, canActivate: [AuthGuard] },
    { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'home' }
];
