import { Routes } from '@angular/router';
import { LoginUserComponent } from '../../auth/user/login-user/login-user.component';
import { RegistroUserComponent } from '../../auth/user/registro-user/registro-user.component';
import { RecuperarPasswordComponent } from '../../auth/user/recuperar-password/recuperar-password.component';
import { VerificarCorreoComponent } from '../../auth/user/verificar-correo/verificar-correo.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { NominacionesComponent } from './nominaciones/nominaciones.component';
import { ContactoComponent } from './contacto/contacto.component';
//import { NotFoundComponent } from '../not-found/not-found.component';
import { InicioComponent } from './inicio/inicio.component';
import { MiInformacionComponent } from './mi-informacion/mi-informacion.component';
import { MisNominacionesComponent } from './mis-nominaciones/mis-nominaciones.component';
import { AuthGuard } from '../../../config/auth.guard';

export const userRoutes: Routes = [
    { path: 'login', component: LoginUserComponent },
    { path: 'registro', component: RegistroUserComponent },
    { path: 'recuperarPassword', component: RecuperarPasswordComponent },
    { path: 'verificarCorreo', component: VerificarCorreoComponent },
    { path: 'categorias', component: CategoriasComponent },
    { path: 'nominaciones', component: NominacionesComponent },
    { path: 'contacto', component: ContactoComponent },
    { path: 'inicio', component: InicioComponent },
    { path: 'mi-informacion', component: MiInformacionComponent, canActivate: [AuthGuard] },
    { path: 'mis-nominaciones', component: MisNominacionesComponent, canActivate: [AuthGuard] },
    //{ path: 'not-found', component: NotFoundComponent },
    { path: '**', redirectTo: 'inicio' }
];
