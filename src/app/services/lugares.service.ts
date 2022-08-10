
import { Injectable } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { collectionData, CollectionReference, Firestore, QuerySnapshot,query,orderBy } from '@angular/fire/firestore';
import { addDoc, collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LugaresService {
  db: Firestore;
  categoriaCol: CollectionReference<DocumentData>;
  private updatedSnapshot = new Subject<QuerySnapshot<DocumentData>>();
  obsr_UpdatedSnapshot = this.updatedSnapshot.asObservable();

  constructor(

    private toastr: ToastrService,
    private firestore: Firestore
  ) { 
    this.db = getFirestore();
    this.categoriaCol = collection(this.db, 'lugares');
    onSnapshot(this.categoriaCol, (snapshot) => {
      this.updatedSnapshot.next(snapshot);
    }, (err) => {
      console.log(err);
    })
  }

  getLugares(){
    const categoriasCollection = collection(this.firestore, 'lugares');
    return collectionData(query(categoriasCollection, orderBy("idLugar", "asc")));
  }

  async addLugar(idLugar:string, disponible: boolean,precio:number) {
    await addDoc(this.categoriaCol, {
      idLugar,
      disponible,
      precio,
    })
    return this.toastr.success('Registro Guardado  con exito!!', 'Exito');
  }
}
