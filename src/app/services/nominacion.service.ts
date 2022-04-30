import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, where } from '@angular/fire/firestore';
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
      console.log('La nominacion se grabo con el ID: ', docRef.id);
      this.variablesGL.endProcessNominacion.next(docRef.id);
    })
    .catch(error => {
      console.log('La nominacion no se grabo: ', error);
      //this.idsImageSaveErr.push({img: img, err: error});
      this.variablesGL.endProcessNominacion.next('');
    });
  }

  getNominaciones(){
    let uid = JSON.parse(localStorage.d).uid;
    const itemsCollection = collection(this.afs,'nominaciones'); //where('uid', '==', uid)
    return collectionData(itemsCollection);
  }
}
