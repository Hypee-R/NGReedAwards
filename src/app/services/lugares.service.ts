
import { Injectable } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { collectionData, CollectionReference, Firestore, QuerySnapshot,query,orderBy } from '@angular/fire/firestore';
import { addDoc, collection, doc, getDocs, getFirestore, onSnapshot, updateDoc, where } from 'firebase/firestore';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { boleto } from '../modules/reedevento/home/pago/pago.component';

@Injectable({
  providedIn: 'root'
})
export class LugaresService {
  db: Firestore;
  categoriaCol: CollectionReference<DocumentData>;
  private updatedSnapshot = new Subject<QuerySnapshot<DocumentData>>();
  obsr_UpdatedSnapshot = this.updatedSnapshot.asObservable();
   
  id:any
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

  getLugaresPagados(boleto:boleto){
    const categoriasCollection = collection(this.firestore, 'lugares');
    
    return collectionData(query(categoriasCollection,where("idLugar","==",boleto.idLugar), orderBy("idLugar", "asc")));
  }

  /*async addLugar(idLugar:string, disponible: boolean,precio:number) {
    await addDoc(this.categoriaCol, {
      idLugar,
      disponible,
      precio,
    })
    return this.toastr.success('Registro Guardado  con exito!!', 'Exito');
  }*/

  async updatelugarPagado( boletos:boleto[]) {
    for(let boleto of boletos){
      let idLugar=boleto.idLugar
      let apartado= true
      let fecha =boleto.hora
      let comprado=true
    const querySnapshot = await getDocs(query(collection(this.db, "lugares/"), where("idLugar", "==", boleto.idLugar)));
    querySnapshot.forEach((doc) => {
    this.id = doc.id  
      })
    const docRef = doc(this.db, 'lugares/'+ this.id);
    await updateDoc( docRef, { idLugar,  apartado,fecha,comprado})}
    return this.toastr.warning('Reservacion valida durante 2 min!!','Seleccionar forma de pago');}



  async updatelugarApartado( boletos:boleto[]) {
    for(let boleto of boletos){
      let idLugar=boleto.idLugar
      let apartado= true
      let fecha =boleto.hora
    const querySnapshot = await getDocs(query(collection(this.db, "lugares/"), where("idLugar", "==", boleto.idLugar)));
    querySnapshot.forEach((doc) => {
    this.id = doc.id  
      })
    const docRef = doc(this.db, 'lugares/'+ this.id);
    await updateDoc( docRef, { idLugar,  apartado,fecha})}
    return this.toastr.warning('Reservacion valida durante 2 min!!','Seleccionar forma de pago');}



    async cancelarLugar( boletos:boleto[]) {
      for(let boleto of boletos){
        let idLugar=boleto.idLugar
        let apartado= false
        let comprado= false
        let fecha= null
      const querySnapshot = await getDocs(query(collection(this.db, "lugares/"), where("idLugar", "==", boleto.idLugar)));
      querySnapshot.forEach((doc) => {
      this.id = doc.id  
        })
      const docRef = doc(this.db, 'lugares/'+ this.id);
      await updateDoc( docRef, { idLugar, apartado,comprado,fecha})}
      return this.toastr.warning('Reservacion cancelada');}

      async cancelarLugarAparatdo( boleto:boleto) {
       
          let idLugar=boleto.idLugar
          let apartado= false
          let comprado=false
          let fecha = null
        const querySnapshot = await getDocs(query(collection(this.db, "lugares/"), where("idLugar", "==", boleto.idLugar)));
        querySnapshot.forEach((doc) => {
        this.id = doc.id  
          })
        const docRef = doc(this.db, 'lugares/'+ this.id);
        await updateDoc( docRef, { idLugar, apartado,comprado ,fecha})
        }
  }




