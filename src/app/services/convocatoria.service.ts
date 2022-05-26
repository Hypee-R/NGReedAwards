import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, DocumentData, CollectionReference, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class ConvocatoriasService {
  db: Firestore;
  convocatoriaCol: CollectionReference<DocumentData>;
  private updatedSnapshot = new Subject<QuerySnapshot<DocumentData>>();
  obsr_UpdatedSnapshot = this.updatedSnapshot.asObservable();
  
  constructor(
    private toastr: ToastrService,
    private firestore: Firestore
  ){
   
    this.db = getFirestore();
    this.convocatoriaCol = collection(this.db, 'convocatorias');
   // Get Realtime Data
   console.log(this.convocatoriaCol);
   
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


async addConvocatoria(titulo: string, fechaInicio: string, fechaFin: string) {
  await addDoc(this.convocatoriaCol, {
    titulo,
    fechaInicio,
    fechaFin
  })
  return this.toastr.success('Registro Guardado  con exito!!', 'Exito');
}

async deleteConvocatoria(docId: string) {
  const docRef = doc(this.db, 'convocatorias', docId)
  await deleteDoc(docRef);
  return    this.toastr.error('Registro Eliminado con exito!!','Advertencia');
}

async updateConvocatoria( titulo: string, fechaInicio: string,fechaFin: string,id:string) {
  const docRef = doc(this.db, 'convocatorias', id);
  await updateDoc(docRef, { titulo, fechaInicio,fechaFin })
  return this.toastr.warning('Registro Actualizado con exito!!','Actualizacion');  
}


  getConvocatorias(){
    const convocatoriasCollection = collection(this.firestore, 'convocatorias');
    return collectionData(convocatoriasCollection);
  }


  

}
