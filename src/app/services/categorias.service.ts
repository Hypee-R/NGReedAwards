import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, getDoc, deleteDoc, doc, updateDoc, DocumentData, CollectionReference, onSnapshot, QuerySnapshot, query, orderBy, where, DocumentReference, getDocs } from 'firebase/firestore';
import { collectionChanges, collectionData, Firestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { initializeApp } from "firebase/app";
@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  db: Firestore;
  categoriaCol: CollectionReference<DocumentData>;
  private updatedSnapshot = new Subject<QuerySnapshot<DocumentData>>();
  obsr_UpdatedSnapshot = this.updatedSnapshot.asObservable();
  
 id:any
  constructor(
    private toastr: ToastrService,
    private firestore: Firestore
  ){
   
    this.db = getFirestore();
    this.categoriaCol = collection(this.db, 'categorias');
   // Get Realtime Data
   onSnapshot(this.categoriaCol, (snapshot) => {
    this.updatedSnapshot.next(snapshot);
  }, (err) => {
    console.log(err);
  })


  
}
  
  //Ya estaba ---Nominaciones
  getCategorias(){
    const categoriasCollection = collection(this.firestore, 'categorias');
    return collectionData(query(categoriasCollection, orderBy("id", "asc")));
  }
  //Ya estaba---Nominaciones
  getexcel(exc: any){
    // await addDoc(this.categoriaCol, {id, nombre})
  }
  
  async addcategoria(id:number, nombre: string) {
    await addDoc(this.categoriaCol, {
      id,
      nombre
    })
    return this.toastr.success('Registro Guardado  con exito!!', 'Exito');
  }
  
  async deletecategoria(id: string) {
    const querySnapshot = await getDocs(query(collection(this.db, "categorias/"), where("id", "==", id)));
querySnapshot.forEach((doc) => {
  this.id = doc.id
})
const docRef = doc(this.db, 'categorias/'+ this.id)
  deleteDoc(docRef)
  return    this.toastr.error('Registro Eliminado con exito!!','Advertencia');
  }
  
  async updatecategoria(id: number, nombre: any) {
    const querySnapshot = await getDocs(query(collection(this.db, "categorias/"), where("id", "==", id)));
querySnapshot.forEach((doc) => {
  this.id = doc.id
})
    const docRef = doc(this.db, 'categorias/'+ this.id);
  await updateDoc( docRef, { id, nombre })
  return this.toastr.warning('Registro Actualizado con exito!!','Actualizacion'); 
  }
  
  
    
  
  
    
  
  }
  

