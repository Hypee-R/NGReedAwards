import { Component, OnInit } from '@angular/core';
import { collectionData, DocumentData, getDocs, QuerySnapshot } from '@angular/fire/firestore';
import { collection, doc, Firestore, getDoc, getFirestore, setDoc } from "@angular/fire/firestore";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProfileUser } from 'src/app/models/user';
import { UsuarioService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  users: ProfileUser [] = [];
  usuario: any;
  //categoriaCollectiondata: { id: string, titulo: string, fechaInicio: Date, fechaFin: Date }[] | any = [];
  
  
  usuarioCollectionData: {uid: string, email: string, firstName: string, lastName: string, displayName: string, phone: string, address: string, photoURL: string, rol: string }[] | any = [];
  usuarioForm: FormGroup;
  submitted: boolean;


  constructor(
    private firebaseService: UsuarioService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    
  }

  ngOnInit(): void {
    this.initForm();
    
    this.get();
    this.firebaseService.obsr_UpdatedSnapshot.subscribe((snapshot) => {
      this.updateUsuarioCollection(snapshot);
    })
  }

  initForm(){
    this.usuarioForm = this.fb.group({
      fistName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      displayName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      photoURL: ['', [Validators.required]],
      rol: ['', [Validators.required]],
    })
  }

  async add() {
    this.submitted = true;

    if(this.usuarioForm.valid){

   const { 
      uid,
      fistName,
      lastName,
      displayName,
      email,
      phone,
      address,
      photoURL,
      rol
   } = this.usuario;
    await this.firebaseService.addUsuario(uid,fistName, lastName, displayName, email, phone, address, photoURL, rol);
    // this.usuario.id = "";
    this.usuario.fistName = "";

    }else{

      this.toastr.info('Todos los Campos son requeridos!!', 'Espera');

    }



  }

  async get() {
    const snapshot = await this.firebaseService.getUsuarios();
    //this.updatecategoriaCollection(snapshot);
  }

  updateUsuarioCollection(snapshot: QuerySnapshot<DocumentData>) {
    this.usuarioCollectionData = [];
    snapshot.docs.forEach((element) => {
      this.usuarioCollectionData.push({ ...element.data(), id: element.id });
    })
  }

  async delete(docId: string) {
    await this.firebaseService.deleteUsuario(docId);
  }

  async update(docId: string, firstName: string, lastName: string, displayName: string, email: HTMLInputElement, phone: string, address: string, photoURL: string, rol: HTMLInputElement) {
    await this.firebaseService.updateUsuario( docId, firstName, lastName, displayName, email.value, phone, address, photoURL, rol.value);
  }

  //TODO: get users list from firebase
  // async getUsers() {
  //   const usersRef = collection(this.afs, 'usuarios');
  //   const usersSnapshot = await getDocs(usersRef);
  //   usersSnapshot.forEach(
  //     (doc) => {
  //       console.log(doc.data());
  //       //parse data
  //       const user = doc.data() as ProfileUser;
  //       //add to users array
  //       this.users.push(user);
        
  //     }
  //   )

  // }

  // //TODO: change rol
  // async changeRol(user: ProfileUser) {
  //   const userRef = doc(this.afs, `usuarios/${user.uid}`);
  //   const userSnapshot = await getDoc(userRef);
  //   const userData = userSnapshot.data();
  //   if(userData.rol === 'admin') {
  //     await setDoc(userRef, { rol: 'user' });
  //   } else {
  //     await setDoc(userRef, { rol: 'admin' });
  //   }
  //   this.toastr.success('Rol cambiado con exito!', 'Exito');
  // }


}
