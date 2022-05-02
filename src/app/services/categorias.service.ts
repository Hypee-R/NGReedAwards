import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection, orderBy, query } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  constructor(
    private firestore: Firestore
  ){}

  getCategorias(){
    const categoriasCollection = collection(this.firestore, 'categorias');
    return collectionData(query(categoriasCollection, orderBy("id", "asc")));
  }
}
