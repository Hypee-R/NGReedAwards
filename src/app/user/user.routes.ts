import { Routes } from '@angular/router';
import { LoginUserComponent } from '../auth/user/login-user/login-user.component';
import { RegistroUserComponent } from '../auth/user/registro-user/registro-user.component';
import { RecuperarPasswordComponent } from '../auth/user/recuperar-password/recuperar-password.component';
import { VerificarCorreoComponent } from '../auth/user/verificar-correo/verificar-correo.component';
//import { NotFoundComponent } from '../not-found/not-found.component';

export const userRoutes: Routes = [
    { path: 'login', component: LoginUserComponent },
    { path: 'registro', component: RegistroUserComponent },
    { path: 'recuperarPassword', component: RecuperarPasswordComponent },
    { path: 'verificarCorreo', component: VerificarCorreoComponent },
    //{ path: 'not-found', component: NotFoundComponent },
    //{ path: '**', redirectTo: 'not-found' }
];
