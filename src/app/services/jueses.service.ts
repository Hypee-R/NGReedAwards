import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, DocumentData, CollectionReference, onSnapshot, QuerySnapshot, query, orderBy } from 'firebase/firestore';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export interface Item { name: string; }
@Injectable({
  providedIn: 'root'
})
export class JuesesService {
  db: Firestore;
  juesesCol: CollectionReference<DocumentData>;
  private updatedSnapshot = new Subject<QuerySnapshot<DocumentData>>();
  obsr_UpdatedSnapshot = this.updatedSnapshot.asObservable();
  constructor(
    private toastr: ToastrService,
    private firestore: Firestore
  ) {
    this.db = getFirestore();
    this.juesesCol = collection(this.db, 'jueces');
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
  
  async updatejueses( name: string, id:string) {
    const docRef = doc(this.db, 'jueces', id);
    await updateDoc(docRef, { name })
    return this.toastr.warning('Registro Actualizado con exito!!','Actualizacion');  
  }

}
