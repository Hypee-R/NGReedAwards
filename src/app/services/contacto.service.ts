import { Injectable } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import {  collection, addDoc,  deleteDoc, doc, updateDoc, DocumentData, CollectionReference,  QuerySnapshot, getDocs, getFirestore, onSnapshot,  } from 'firebase/firestore';
import { ContactoModel } from '../models/contacto.model';
import { VariablesService } from './variablesGL.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  db: Firestore;
  contactoCol: CollectionReference<DocumentData>;
  private updatedSnapshot = new Subject<QuerySnapshot<DocumentData>>();
  obsr_UpdatedSnapshot = this.updatedSnapshot.asObservable();

  listaNominaciones: ContactoModel[] = [];

  constructor(
    private toastr: ToastrService,
    private firestore: Firestore,
    private afs: Firestore,
    private variablesGL: VariablesService,
  ){
    this.db = getFirestore();
    this.contactoCol = collection(this.db, 'mensajesContacto');
   // Get Realtime Data
   onSnapshot(this.contactoCol, (snapshot) => {
    this.updatedSnapshot.next(snapshot);
  }, (err) => {
    console.log(err);
  })
  }

  async addNominacion(contacto: ContactoModel){
    await addDoc(collection(this.afs,'mensajesContacto'), contacto)
    .then(docRef => {
      console.log('El CONTACTO se grabo con el ID: ', docRef.id);
      this.variablesGL.endProcessNominacion.next(docRef.id);
    })
    .catch(error => {
      console.log('EL CONTACTO no se grabo: ', error);
      this.variablesGL.endProcessNominacion.next('');
    });
  }

  async addcontacto(correo: string,mensaje: string,nombre: string) {
    await addDoc(this.contactoCol, {
      correo,
      mensaje,
      nombre,

    })
    return this.toastr.success('Registro Guardado  con exito!!', 'Exito');
  }

  async deletecontacto(docId: string) {
    const docRef = doc(this.db, 'mensajesContacto', docId)
   await deleteDoc(docRef);
   return    this.toastr.error('Registro Eliminado con exito!!','Advertencia');
  }

  async updatecontacto(docId: string, correo: string,mensaje: string,nombre: string) {
    const docRef = doc(this.db, 'mensajesContacto', docId);
    await updateDoc(docRef, { correo,mensaje,nombre })
   return this.toastr.warning('Registro Actualizado con exito!!','Actualizacion');
  }


    getcontactos(){
      const contactosCollection = collection(this.firestore, 'mensajesContacto');
      return collectionData(contactosCollection);
    }

    async getContactos() {
      const snapshot = await getDocs(this.contactoCol);
      return snapshot;
    }
    

  }
