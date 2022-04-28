import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';
//import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
//import { uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FileItem, ImageModel } from '../shared/models/img.model';
import { getApp } from '@angular/fire/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { VariablesService } from './variablesGL.service';

@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {
  private carpetaImagenes = 'files';
  public idsImageSave: any[] = [];
  public idsImageErr: any[] = [];
  public endProcess= false;
  public endProcess2= false;
  contador = 1;
  contador2 = 1;
  constructor(
    private afs: Firestore,
    private variablesGL: VariablesService,
  ) {}

  addImage(img: ImageModel){
    //this.itemsCollection.add(img)
    addDoc(collection(this.afs,'img'), img)
    .then(docRef => {
      console.log('El Documento se grabo con el ID: ', docRef.id);
      this.idsImageSave.push({ fileMapped: img.fileMapped, idDoc: docRef.id });
      this.contador2++;
      if(this.contador == this.contador2){
        this.endProcess2 = true;
        this.variablesGL.endProcess.next(this.endProcess2);
      }
    })
    .catch(error => {
      console.log('El Documento no se grabo: ', error);
      this.idsImageErr.push({img: img, err: error});
    });
  }

  getImages(){
    const itemsCollection = collection(this.afs,'items');
    return collectionData(itemsCollection);
  }

  upload(files: FileItem[]){
    const firebaseApp = getApp();
    const storage = getStorage(firebaseApp, 'gs://rewards-latino.appspot.com');

    for(const file of files){

      file.subiendo = true;
      if(file.progreso >= 100){
        continue;
      }

      const storageRef = ref(storage, `${this.carpetaImagenes}/${file.nombreArchivo}`);

      const uploadTask = uploadBytesResumable(storageRef, file.archivo);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          file.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          //console.log('Upload is ' + file.progreso + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log("error en subir las imagenes");

        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            //console.log('File available at', downloadURL);
            file.url = downloadURL;
            file.subiendo = false;

            this.addImage({
              nombre: file.nombreArchivo,
              url: file.url,
              fileMapped: file.fileMapped,
              uid: JSON.parse(localStorage.d).uid
            });
            this.contador++;
            if(this.contador >= files.length){
                if(this.contador2 == this.contador){
                  this.endProcess = true;
                  this.variablesGL.endProcess.next(this.endProcess);
                }
            }

          });
        }
      );
    }
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

  //     this.utask

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
