import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-nominaciones',
  templateUrl: './nominaciones.component.html',
  styleUrls: ['./nominaciones.component.css']
})
export class NominacionesComponent implements OnInit {

  nominaciones: any;
  categorias: any;
  constructor(
    private firestore: Firestore
  ) {
    this.getNominaciones();
    this.getCategorias();
   }

  ngOnInit(): void {
  }

  
  async getNominaciones(){
    const nominacionesCollection = collection(this.firestore, 'nominaciones');
    collectionData(nominacionesCollection).subscribe( (data) => {
      this.nominaciones = data;
      console.log('data nominaciones ', this.nominaciones);
    });
  }


   
  async getCategorias(){
    const categoriasCollection = collection(this.firestore, 'categorias');
    collectionData(categoriasCollection).subscribe( (data) => {
      this.categorias = data;
      console.log('data categorias ', this.categorias);
    });
  }
}
