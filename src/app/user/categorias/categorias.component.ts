import { Component, OnInit } from '@angular/core';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
// import { CategoriasService } from "./shared/categorias.service";
// providers: [CategoriasService]

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  categorias;
   getcategorias = () =>
      this.categorias
      .getcategorias()
      .subscribe(res =>(this.categorias = res));

}
