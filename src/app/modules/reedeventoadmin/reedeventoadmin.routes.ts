import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from 'src/config/auth.guard';
export const reedeventoadminRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: '**', redirectTo: 'home' }
];
