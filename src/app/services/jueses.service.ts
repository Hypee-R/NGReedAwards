import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, DocumentData, CollectionReference, onSnapshot, QuerySnapshot, query, orderBy, FieldValue, arrayRemove } from 'firebase/firestore';
import { arrayUnion, collectionData, Firestore, where } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export interface Item { name: string; }
@Injectable({
  providedIn: 'root'
})
export class JuesesService {
  db: Firestore;
  juesesCol: any;
  private updatedSnapshot = new Subject<QuerySnapshot<DocumentData>>();
  obsr_UpdatedSnapshot = this.updatedSnapshot.asObservable();
  constructor(
    private toastr: ToastrService,
    private firestore: Firestore
  ) {
    this.db = getFirestore();
    this.juesesCol = query(collection(this.db, 'usuarios'), where("rol", "==", "juez"))
   // Get Realtime Data
  //  console.log(this.juesesCol);

  onSnapshot(this.juesesCol, (snapshot) => {
    this.updatedSnapshot.next(snapshot);
  }, (err) => {
    console.log(err);
  })
  }
  async getJueses() {
    const snapshot = await getDocs(this.juesesCol);
    return snapshot;
  }

  async addJues(name: any) {
    await addDoc(this.juesesCol, {
      name
    })
    return this.toastr.success('Registro Guardado  con exito!!', 'Exito');
  }

  async deletejueses(docId: string) {
    const docRef = doc(this.db, 'jueces', docId)
    await deleteDoc(docRef);
    return    this.toastr.error('Registro Eliminado con exito!!','Advertencia');
  }

  //aqui agregregale el array categoriass
  async updatejueses( name: string, id:string, selectedCategories:[],selectedCategoriesRemove:[]) {
    const docRef = doc(this.db, 'usuarios', id);
    console.log(docRef);
    //Test de carga de arrays dummy
    //await updateDoc(docRef, { displayName: name, categorias: arrayUnion({0:"categoria 1"}) })
    //test de added arrays:arrayUnion
    await updateDoc(docRef, { displayName: name, categorias: arrayUnion(...selectedCategories) })
    //test remove arrays :arrayRemove
    const filteredLibraries = selectedCategoriesRemove.filter((item) => item !== selectedCategories);
     await updateDoc(docRef, { displayName: name, categorias: arrayRemove(...filteredLibraries) })
    return this.toastr.warning('Registro Actualizado con exito!!','Actualizacion');
  }

}
