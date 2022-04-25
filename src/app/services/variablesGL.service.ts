import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Toast } from '../shared/models/toast.model';
import { SwalModel } from 'src/app/shared/models/swal.model';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  showSideUser = new Subject<boolean>();
  showSideBar = new Subject<boolean>();
  changeTipoMenu = new Subject<boolean>();

  toastLogin = new BehaviorSubject<Toast>(null);
  toast = new BehaviorSubject<Toast>(null);
  swal = new BehaviorSubject<SwalModel>(null);
  pagina = new BehaviorSubject<string>("");

  constructor(
    private router: Router
  ) {
  }

  getStatusPantalla(): number {
    let width = window.screen.width;

    if (width < 640) return 1;
    else if (width > 640 && width < 769) return 10;
    else return 17;
  }

  removeCredential() {
    this.router.navigate(['/'], { replaceUrl: true });
    localStorage.d = "";
    localStorage.clear();
    location.reload();
  }

  getDataTable(data: any): any {
    let arregloCols: any[] = [];
    let headers = Object.keys(data[0]);

    headers.map(h => {
      if (h.substring(0,2).toLowerCase() != "id"){
        arregloCols.push({
            field: h,
            header: h
        });
      }
    });

    let arregloRows: any[] = [];
    data.map((row) => {
      let x: any = [];
      headers.map((h) => {
          x[h] = row[h];
      });
      arregloRows.push(x)
    });

    return { cols: arregloCols, rows: arregloRows };
  }

  setMenuBreadcrumb(menu: string){
    localStorage.removeItem('pg');
    localStorage.setItem('pg', menu);
    this.pagina.next(menu);
  }

  setMenu(url: string){
    let rutaActual = localStorage.getItem('pg');
    switch(url)
    {
        case '/home':
                      if(rutaActual != "Home"){
                          this.setMenuBreadcrumb("Home");
                      }
          break;
        case '/dashboard':
                      if(rutaActual != "Dashboard"){
                          this.setMenuBreadcrumb("Dashboard");
                      }
          break;
        case '/customers':
                      if(rutaActual != "Customers"){
                          this.setMenuBreadcrumb("Customers");
                      }
          break;
        case '/analytics':
                      if(rutaActual != "Analytics"){
                          this.setMenuBreadcrumb("Analytics");
                      }
          break;
        case '/messages':
                      if(rutaActual != "Messages"){
                          this.setMenuBreadcrumb("Messages");
                      }
          break;
        case '/products':
                      if(rutaActual != "Products"){
                          this.setMenuBreadcrumb("Products");
                      }
          break;
        case '/reports':
                      if(rutaActual != "Reports"){
                          this.setMenuBreadcrumb("Reports");
                      }
          break;
        case '/settings':
                      if(rutaActual != "Settings"){
                          this.setMenuBreadcrumb("Settings");
                      }
          break;
        case '/add-product':
                      if(rutaActual != "Add Product"){
                          this.setMenuBreadcrumb("Add Product");
                      }
          break;
    }
    if(this.getStatusPantalla() <= 10){
        this.showSideBar.next(false);
    }
  }
}
