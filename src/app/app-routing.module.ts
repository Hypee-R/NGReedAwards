import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../config/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [

  {
    path: 'reedevento',
    loadChildren: () => import('./modules/reedevento/reedevento.module').then(m => m.ReedEventoModule),
    //canLoad: [AuthGuard]
  },
  {
    path: 'reedeventoadmin',
    loadChildren: () => import('./modules/reedeventoadmin/reedeventoadmin.module').then(m => m.ReedEventoAdminModule),
    //canLoad: [AuthGuard]
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'reedevento' }
];

@NgModule({

  declarations: [
    NotFoundComponent
  ],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule,
    NotFoundComponent
  ]
})
export class AppRoutingModule { }
