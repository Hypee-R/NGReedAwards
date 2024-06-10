import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  // url: string = 'https://restcountries.com/v3.1/all';
  // constructor(
  //   private http: HttpClient,
  // ){

  // }

  // getPaises(){
  //   return this.http.get(this.url);
  // }

  // URL del archivo JSON local
  private url: string = 'assets/utils/Paises.json';

  constructor(private http: HttpClient) { }

  // Método para obtener los datos del JSON local
  getPaises(): Observable<any> {
    return this.http.get(this.url);
  }

}
