import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, updateDoc, deleteDoc, getFirestore } from '@angular/fire/firestore';
import { doc, getDocs, query, where } from 'firebase/firestore';
import { NominacionModel } from '../models/nominacion.model';
import { VariablesService } from './variablesGL.service';

@Injectable({
  providedIn: 'root'
})
export class NominacionService {
  listaNominaciones: NominacionModel[] = [];
  pipe = new DatePipe('en-US');
  constructor(
    private afs: Firestore,
    private variablesGL: VariablesService,
  ){
  }
  
  async addNominacion(nominacion: NominacionModel){
    nominacion.fechaCreacion = this.pipe.transform(Date.now(), 'dd/MM/yyyy, h:mm:ss a');
    await addDoc(collection(this.afs,'nominaciones'), nominacion)
    .then(docRef => {
      console.log('La nominacion se grabo con el ID: ', docRef.id);
      this.variablesGL.endProcessNominacion.next(docRef.id);
    })
    .catch(error => {
      console.log('La nominacion no se grabo: ', error);
      this.variablesGL.endProcessNominacion.next('');
    });
  }

  async updateNominacion(updateNominacion: NominacionModel){
    const db = getFirestore();
    // const cityRef = doc(db, 'nominaciones', 'updateNominacion.id');
    // setDoc(cityRef, { capital: true }, { merge: true });

    const nominacionesRef = doc(db, "nominaciones", updateNominacion.id);
    //console.log('datatatata ', getDoc(washingtonRef));

    await updateDoc(nominacionesRef, {
      titulo: updateNominacion.titulo,
      categoria: updateNominacion.categoria,
      nominado: updateNominacion.nominado,
      descripcion: updateNominacion.descripcion,
      fileLogoEmpresa: updateNominacion.fileLogoEmpresa,
      organizacion:updateNominacion.organizacion,
      responsable:updateNominacion.responsable,
      telefono:updateNominacion.telefono,
      pais:updateNominacion.pais,
      rsInstagram: updateNominacion.rsInstagram,
      rsTwitter: updateNominacion.rsTwitter,
      rsFacebook: updateNominacion.rsFacebook,
      rsYoutube: updateNominacion.rsYoutube,
      fileCesionDerechos: updateNominacion.fileCesionDerechos,
      fileCartaIntencion: updateNominacion.fileCartaIntencion,
      materialMultimedia: updateNominacion.materialMultimedia,
      fileBaucher: updateNominacion.fileBaucher,
      pagarCon:updateNominacion.pagarCon,
      statuspago:updateNominacion.statuspago,
      idpago:updateNominacion.idpago,
      montopago:updateNominacion.montopago,
      uid:updateNominacion.uid,
      fechaCreacion: updateNominacion.fechaCreacion,
      fechaActualizacion: this.pipe.transform(Date.now(), 'dd/MM/yyyy, h:mm:ss a'),
      //fechapago: updateNominacion.fechapago,
      evaluacion:updateNominacion.evaluacion
    });
  }

  async updateStatusPagoNominacion(updateNominacion: NominacionModel){
    const db = getFirestore();
    // const cityRef = doc(db, 'nominaciones', 'updateNominacion.id');
    // setDoc(cityRef, { capital: true }, { merge: true });

    const nominacionesRef = doc(db, "nominaciones", updateNominacion.id);
    //console.log('datatatata ', getDoc(washingtonRef));

    await updateDoc(nominacionesRef, {
      statuspago:updateNominacion.statuspago,
      fechapago:updateNominacion.fechapago,
    });
  }

  async deleteNominacion(deleteNominacion: NominacionModel){

    const db = getFirestore();
    const nominacionRef = doc(db, "nominaciones", deleteNominacion.id);

    await deleteDoc(nominacionRef);
  }

  async getNominaciones(){
    this.listaNominaciones = [];
    let uid = JSON.parse(localStorage.d).uid;
    const itemsCollection = collection(this.afs,'nominaciones'); //where('uid', '==', uid)
    // return collectionData(query(itemsCollection, where("uid", "==", uid)));
    const q = query(itemsCollection, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        this.listaNominaciones.push({
            id: doc.id,
            titulo: doc.data().titulo,
            categoria: doc.data().categoria,
            nominado: doc.data().nominado,
            descripcion: doc.data().descripcion,
            fileLogoEmpresa: doc.data().fileLogoEmpresa,
            organizacion:doc.data().organizacion,
            responsable:doc.data().responsable,
            telefono:doc.data().telefono,
            pais:doc.data().pais,
            rsInstagram: doc.data().rsInstagram,
            rsTwitter: doc.data().rsTwitter,
            rsFacebook: doc.data().rsFacebook,
            rsYoutube: doc.data().rsYoutube,
            fileCesionDerechos: doc.data().fileCesionDerechos,
            fileCartaIntencion: doc.data().fileCartaIntencion,
            materialMultimedia: doc.data().materialMultimedia,
            fileBaucher: doc.data().fileBaucher,
            pagarCon:doc.data().pagarCon,
            statuspago:doc.data().statuspago,
            idpago:doc.data().idpago,
            fechapago:doc.data().fechapago,
            montopago:doc.data().montopago,
            uid:doc.data().uid,
            fechaCreacion:doc.data().fechaCreacion,
            fechaActualizacion: doc.data().fechaActualizacion,
            evaluacion: doc.data().evaluacion
        });
        //console.log(doc.id, " => ", doc.data());
    });
    return this.listaNominaciones;
  }

  async getAllNominaciones(){
    this.listaNominaciones = [];
    let uid = JSON.parse(localStorage.d).uid;
    const itemsCollection = collection(this.afs,'nominaciones'); //where('uid', '==', uid)
    // return collectionData(query(itemsCollection, where("uid", "==", uid)));
    const q = query(itemsCollection);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        this.listaNominaciones.push({
            id: doc.id,
            titulo: doc.data().titulo,
            categoria: doc.data().categoria,
            nominado: doc.data().nominado,
            descripcion: doc.data().descripcion,
            fileLogoEmpresa: doc.data().fileLogoEmpresa,
            organizacion:doc.data().organizacion,
            responsable:doc.data().responsable,
            telefono:doc.data().telefono,
            pais:doc.data().pais,
            rsInstagram: doc.data().rsInstagram,
            rsTwitter: doc.data().rsTwitter,
            rsFacebook: doc.data().rsFacebook,
            rsYoutube: doc.data().rsYoutube,
            fileCesionDerechos: doc.data().fileCesionDerechos,
            fileCartaIntencion: doc.data().fileCartaIntencion,
            materialMultimedia: doc.data().materialMultimedia,
            fileBaucher: doc.data().fileBaucher,
            pagarCon:doc.data().pagarCon,
            statuspago:doc.data().statuspago,
            idpago:doc.data().idpago,
            fechapago:doc.data().fechapago,
            montopago:doc.data().montopago,
            uid:doc.data().uid,
            fechaCreacion: doc.data().fechaCreacion,
            fechaActualizacion: doc.data().fechaActualizacion,
            evaluacion:doc.data().evaluacion
        });
        //console.log(doc.id, " => ", doc.data());
    });
    return this.listaNominaciones;
  }

  async getAllNominacionesFilterCategorias(filter:string[]){
    this.listaNominaciones = [];
    let uid = JSON.parse(localStorage.d).uid;
    const itemsCollection = collection(this.afs,'nominaciones'); //where('uid', '==', uid)
   
    console.log(filter.length==0)
    if(filter.length==0){
      filter=[""]
    }
  
    // return collectionData(query(itemsCollection, where("uid", "==", uid)));
    const q = query(itemsCollection, where("categoria", "in", filter));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        this.listaNominaciones.push({
            id: doc.id,
            titulo: doc.data().titulo,
            categoria: doc.data().categoria,
            nominado: doc.data().nominado,
            descripcion: doc.data().descripcion,
            fileLogoEmpresa: doc.data().fileLogoEmpresa,
            organizacion:doc.data().organizacion,
            responsable:doc.data().responsable,
            telefono:doc.data().telefono,
            pais:doc.data().pais,
            rsInstagram: doc.data().rsInstagram,
            rsTwitter: doc.data().rsTwitter,
            rsFacebook: doc.data().rsFacebook,
            rsYoutube: doc.data().rsYoutube,
            fileCesionDerechos: doc.data().fileCesionDerechos,
            fileCartaIntencion: doc.data().fileCartaIntencion,
            materialMultimedia: doc.data().materialMultimedia,
            fileBaucher: doc.data().fileBaucher,
            pagarCon:doc.data().pagarCon,
            statuspago:doc.data().statuspago,
            idpago:doc.data().idpago,
            fechapago:doc.data().fechapago,
            montopago:doc.data().montopago,
            uid:doc.data().uid,
            fechaCreacion: doc.data().fechaCreacion,
            fechaActualizacion: doc.data().fechaActualizacion,
            evaluacion:doc.data().evaluacion
        });
        //console.log(doc.id, " => ", doc.data());
    });
    return this.listaNominaciones;
  }

  async sendEmail(email:String)
  {
    const db = getFirestore();
     const docRef = await addDoc(collection(db, 'mail'), {
       to: email,
       message: {
         subject: "Correo de prueba",
         html: `
          <p>Estimado usuario de KOI KOI,</p>
          <p>Esperamos que este mensaje te encuentre disfrutando de tu experiencia de lectura digital con nosotros. Como parte de nuestro compromiso continuo de brindarte acceso a una amplia variedad de libros digitales, nos complace anunciar que hemos preparado una emocionante oferta exclusivamente para ti.</p>
          <p>Como muestra de agradecimiento por tu apoyo y fidelidad, estamos encantados de ofrecerte la oportunidad de disfrutar de 5 ediciones gratis de nuestra extensa biblioteca digital. A continuación, te presentamos los libros que podrás disfrutar:</p>
          <ul>
             
          </ul>
          <p>¿Cómo puedes obtener tus 5 ediciones gratis? Es simple:</p>
          <ol>
              <li>Inicia sesión en tu cuenta de KOI KOI.</li>
              <li>Dirígete a la sección de "Mis libros" en la aplicación.</li>
              <li>Reclama las 5 ediciones que más te llamen la atención.</li>
              <li>¡Disfruta de tus nuevos libros digitales!</li>
          </ol>
          <p>¡Gracias por ser parte de nuestra comunidad de lectores digitales! Esperamos que disfrutes al máximo de esta emocionante oferta.</p>
          <p>¡Feliz lectura!</p>
          <p>Atentamente,</p>
          <p>App KOI KOI</p>
      `,
       },
     });
     console.log('El email se grabó con el ID: ', docRef.id);
  }
 
}
