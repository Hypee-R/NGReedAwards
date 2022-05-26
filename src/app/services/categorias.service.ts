import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, DocumentData, CollectionReference, onSnapshot, QuerySnapshot, query, orderBy } from 'firebase/firestore';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  db: Firestore;
  categoriaCol: CollectionReference<DocumentData>;
  private updatedSnapshot = new Subject<QuerySnapshot<DocumentData>>();
  obsr_UpdatedSnapshot = this.updatedSnapshot.asObservable();

  constructor(
    private toastr: ToastrService,
    private firestore: Firestore
  ) {

    this.db = getFirestore();
    this.categoriaCol = collection(this.db, 'categorias');
    // Get Realtime Data
    onSnapshot(this.categoriaCol, (snapshot) => {
      this.updatedSnapshot.next(snapshot);
    }, (err) => {
      console.log(err);
    })
  }

  //Ya estaba
  getCategorias() {
    const categoriasCollection = collection(this.firestore, 'categorias');
    return collectionData(query(categoriasCollection, orderBy("id", "asc")));
  }
  //Ya estaba


  async addcategoria(id: string, nombre: string) {
    await addDoc(this.categoriaCol, {
      id,
      nombre
    })
    return this.toastr.success('Registro Guardado  con exito!!', 'Exito');
  }

  async deletecategoria(docId: string) {
    const docRef = doc(this.db, 'categorias', docId)
    await deleteDoc(docRef);
    return this.toastr.error('Registro Eliminado con exito!!', 'Advertencia');
  }

  async updatecategoria(docId: string, nombre: string) {
    const docRef = doc(this.db, 'categorias', docId);
    await updateDoc(docRef, { nombre })
    return this.toastr.warning('Registro Actualizado con exito!!', 'Actualizacion');
  }


  getcategorias() {
    const categoriasCollection = collection(this.firestore, 'categorias');
    return collectionData(categoriasCollection);
  }




}


