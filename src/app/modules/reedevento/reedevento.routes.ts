import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from 'src/config/auth.guard';
export const reedeventoRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: '**', redirectTo: 'home' }
];
