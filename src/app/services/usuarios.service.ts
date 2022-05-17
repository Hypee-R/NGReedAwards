import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, DocumentData, CollectionReference, onSnapshot, QuerySnapshot, query, orderBy } from 'firebase/firestore';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  db: Firestore;
  usuarioCol: CollectionReference<DocumentData>;
  private updatedSnapshot = new Subject<QuerySnapshot<DocumentData>>();
  obsr_UpdatedSnapshot = this.updatedSnapshot.asObservable();
  
  constructor(
    private toastr: ToastrService,
    private firestore: Firestore
  ){
   
    this.db = getFirestore();
    this.usuarioCol = collection(this.db, 'usuarios');
   // Get Realtime Data
   onSnapshot(this.usuarioCol, (snapshot) => {
    this.updatedSnapshot.next(snapshot);
  }, (err) => {
    console.log(err);
  })
}

  //Ya estaba
  getUsuarios(){
    const categoriasCollection = collection(this.firestore, 'categorias');
    return collectionData(query(categoriasCollection, orderBy("id", "asc")));
  }
  //Ya estaba


  async addUsuario(uid: string, email: string, firstName: string, lastName: string, displayName: string, phone: string, address: string, photoURL: string, rol: string) {
    await addDoc(this.usuarioCol, {
      uid,
      email,
      firstName,
      lastName,
      displayName,
      phone,
      address,
      photoURL,
      rol
    })
    return this.toastr.success('Registro Guardado  con exito!!', 'Exito');
  }
  
  async deleteUsuario(docId: string) {
    const docRef = doc(this.db, 'usuarios', docId)
    await deleteDoc(docRef);
    return    this.toastr.error('Registro Eliminado con exito!!','Advertencia');
  }
  
  async updateUsuario(uid: string, email: string, firstName: string, lastName: string, displayName: string, phone: string, address: string, photoURL: string, rol: string) {
    const docRef = doc(this.db, 'usuarios', uid);
    await updateDoc(docRef, { 
      uid,
      email,
      firstName,
      lastName,
      displayName,
      phone,
      address,
      photoURL,
      rol
     })
    return this.toastr.warning('Registro Actualizado con exito!!','Actualizacion');
  }
  
  
    getusuarios(){
      const usuariosCollection = collection(this.firestore, 'usuarios');
      return collectionData(usuariosCollection);
    }
  
  
    
  
  }
  


