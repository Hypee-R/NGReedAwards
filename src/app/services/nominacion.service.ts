import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { NominacionModel } from '../shared/models/nominacion.model';
import { VariablesService } from './variablesGL.service';

@Injectable({
  providedIn: 'root'
})
export class NominacionService {

  constructor(
    private afs: Firestore,
    private variablesGL: VariablesService,
  ){
  }

  addNominacion(nominacion: NominacionModel){
    addDoc(collection(this.afs,'nominaciones'), nominacion)
    .then(docRef => {
      console.log('El Documento se grabo con el ID: ', docRef.id);
      this.variablesGL.endProcessNominacion.next(docRef.id);
    })
    .catch(error => {
      console.log('El Documento no se grabo: ', error);
      //this.idsImageSaveErr.push({img: img, err: error});
      this.variablesGL.endProcessNominacion.next('');
    });
  }
}
