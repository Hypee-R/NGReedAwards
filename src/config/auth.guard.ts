import { Injectable } from '@angular/core';
import { Router, CanLoad } from '@angular/router';
import { ConfigService } from 'src/config/config.service';
import { VariablesService } from '../app/services/variablesGL.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(
    private autService: ConfigService,
    private variablesService: VariablesService,
    private router: Router
  ) {}

  canLoad(): boolean {
    if (this.autService.token){
      //console.log("Autenticado");
      if(!this.variablesService.pagina.value){
          let paginaActual = localStorage.getItem('pg');
          //this.variablesService.pagina.next(paginaActual);
      }
      return true;
    }else {
      localStorage.clear();
      //console.log("No autenticado");
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
  }

}
