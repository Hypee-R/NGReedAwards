import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, DocumentData, CollectionReference, onSnapshot, QuerySnapshot, query, orderBy, FieldValue } from 'firebase/firestore';
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
  async updatejueses( name: string, id:string, categories: { id: string, name: string }[]) {
    console.log(id, name);
    const docRef = doc(this.db, 'usuarios', id);
    console.log(docRef);
    await updateDoc(docRef, { displayName: name, categorias: arrayUnion(categories) })
    return this.toastr.warning('Registro Actualizado con exito!!','Actualizacion');
  }

}
