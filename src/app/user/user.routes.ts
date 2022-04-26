import { Routes } from '@angular/router';
import { LoginUserComponent } from '../auth/user/login-user/login-user.component';
import { RegistroUserComponent } from '../auth/user/registro-user/registro-user.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { ContactoComponent } from './contacto/contacto.component';
import { NominacionesComponent } from './nominaciones/nominaciones.component';
//import { NotFoundComponent } from '../not-found/not-found.component';

export const userRoutes: Routes = [
    { path: 'login', component: LoginUserComponent },
    { path: 'registro', component: RegistroUserComponent },
    { path: 'categorias', component: CategoriasComponent },
    { path: 'nominaciones', component: NominacionesComponent },
    { path: 'contacto', component: ContactoComponent },
    //{ path: 'not-found', component: NotFoundComponent },
    //{ path: '**', redirectTo: 'not-found' }
];
