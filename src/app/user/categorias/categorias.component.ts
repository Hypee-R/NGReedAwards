import { Component, OnInit } from '@angular/core';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
// import { CategoriasService } from "./shared/categorias.service";
// providers: [CategoriasService]

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

  categorias: any;
  constructor(
    private firestore: Firestore
  ) {
    this.getCategorias();
   }

  ngOnInit(): void {
  }

  async getCategorias(){
    const categoriasCollection = collection(this.firestore, 'categorias');
    collectionData(categoriasCollection).subscribe( (data) => {
      this.categorias = data;
      console.log('data categorias ', this.categorias);
    });
  }


}
