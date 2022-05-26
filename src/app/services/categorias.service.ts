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
getid(){
    const categoriasCollection = collection(this.firestore, 'categorias');
    // console.log(categoriasCollection);
    
    return collectionData(categoriasCollection);
    
    
    
  }
  
  //Ya estaba ---Nominaciones
  getCategorias(){
    const categoriasCollection = collection(this.firestore, 'categorias');
    return collectionData(query(categoriasCollection, orderBy("id", "asc")));
  }
  //Ya estaba---Nominaciones

  
  async addcategoria( nombre: string) {
    await addDoc(this.categoriaCol, {
      nombre
    })
    return this.toastr.success('Registro Guardado  con exito!!', 'Exito');
  }
  
  async deletecategoria(docId: string) {
    // const docRef = collection(this.db, 'categorias')
    
    //  const snap = collectionData(query(docRef, where('id', '==', docId)))
    //  deleteDoc(s)
    
    // const snap = await deleteDoc(doc(this.db, 'categorias/'+ docId))
    // console.log(docId);
    const querySnapshot = await getDocs(query(collection(this.db, "users"), where('id', '==', docId)));
    // querySnapshot.forEach
querySnapshot.forEach((doc) => {
  where('id', '==', docId)
  console.log();
  
  console.log(`${doc.id} => ${doc.data()}`);
})

  
  
  return    this.toastr.error('Registro Eliminado con exito!!','Advertencia');
  }
  
  async updatecategoria(docId: any, nombre: any) {
    const docRef = doc(this.db, 'convocatorias/'+ docId);
  await updateDoc( docRef, {  nombre:nombre })
  // const snap = await updateDoc(doc(this.db, 'categoria/'+docId))
  return this.toastr.warning('Registro Actualizado con exito!!','Actualizacion'); 
  }
  
  
    
  
  
    
  
  }
  

