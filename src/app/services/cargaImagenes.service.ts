import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { FirebaseStorage, StorageReference } from '@angular/fire/storage';
import { FileItem, ImageModel } from '../shared/models/img.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {
  private carpetaImagenes = 'img';
  private itemsCollection: AngularFirestoreCollection<ImageModel>;
  items: Observable<ImageModel[]>;
  constructor(
    private afs: AngularFirestore,
    //private storage: StorageReference,
  ) {
    this.itemsCollection = afs.collection<ImageModel>('items');
    this.items = this.itemsCollection.valueChanges();
  }

  addImage(img: ImageModel){
    this.itemsCollection.add(img)
    .then(docRef => console.log('El Documento se grabo con el ID: ', docRef.id))
    .catch(error => console.log('El Documento no se grabo: ', error));
  }

  // cargarImagenesFirebase(imagenes: FileItem[]){

  //   this.storage.storage;
  //   //const storageRef = firebase.default.storage().ref();
  //   const storageRef = this.storage;

  //   for (const item of imagenes) {

  //     item.subiendo = true;
  //     if(item.progreso >= 100){
  //       continue;
  //     }

  //     const uploadTask: firebase.default.storage.UploadTask = storageRef.child(`${this.carpetaImagenes}/${item.nombreArchivo}`)
  //                               .put( item.archivo );

  //     uploadTask.on( firebase.default.storage.TaskEvent.STATE_CHANGED,
  //                 (snapshot: firebase.default.storage.UploadTaskSnapshot) =>
  //                             item.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
  //                 (err) => console.error("error al subir ", err),
  //                 () => {

  //                   console.log("Imagen cargada correctamente");
  //                   uploadTask.snapshot.ref.getDownloadURL()
  //                   .then((url) => {
  //                     item.url = url;
  //                     item.subiendo = false;

  //                     this.guardarImagen({
  //                       nombre: item.nombreArchivo,
  //                       url: item.url
  //                     });
  //                   });

  //                 });

  //   }

  // }

}
