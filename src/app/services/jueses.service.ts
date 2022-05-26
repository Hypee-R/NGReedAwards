import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, DocumentData, CollectionReference, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class JuesesService {
  db: Firestore;
  convocatoriaCol: CollectionReference<DocumentData>;
  private updatedSnapshot = new Subject<QuerySnapshot<DocumentData>>();
  obsr_UpdatedSnapshot = this.updatedSnapshot.asObservable();
  constructor(
    private toastr: ToastrService,
    private firestore: Firestore
  ) {
    this.db = getFirestore();
    this.convocatoriaCol = collection(this.db, 'convocatorias');
   // Get Realtime Data
   onSnapshot(this.convocatoriaCol, (snapshot) => {
    this.updatedSnapshot.next(snapshot);
  }, (err) => {
    console.log(err);
  })
  }

  
  async getConvocatoria() {
    const snapshot = await getDocs(this.convocatoriaCol);
    return snapshot;
  }
}
