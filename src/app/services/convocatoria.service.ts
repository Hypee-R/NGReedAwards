import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ConvocatoriasService {
  constructor(
    private firestore: Firestore
  ){}

  getConvocatorias(){
    const convocatoriasCollection = collection(this.firestore, 'convocatorias');
    return collectionData(convocatoriasCollection);
  }

}
