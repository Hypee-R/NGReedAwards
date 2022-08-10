import { Component, OnInit } from '@angular/core';
import { DocumentData,  QuerySnapshot } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { ProfileUser } from 'src/app/models/user';
import { ExcelService } from 'src/app/services/excel.service';
import { UsuarioService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  users: ProfileUser[] = [];
  usuario: any;
  //categoriaCollectiondata: { id: string, titulo: string, fechaInicio: Date, fechaFin: Date }[] | any = [];


  usuarioCollectionData: { address: string, email: string, displayName: string, firstName: string, lastName: string, phone: string, photoURL: string, rol: string, uid: string }[] | any = [];
  usuarioForm: FormGroup;
  submitted: boolean =  false;
  loading:boolean = true

  usuarioModel: any;
  visible: boolean = false

  visibleDe:boolean= false;
  uid: any;
  constructor(
    private firebaseService: UsuarioService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private Excel: ExcelService,
    private confirmationService: ConfirmationService
  ) {

  }

  ngOnInit(): void {
    this.initForm();

    this.get();
    this.firebaseService.obsr_UpdatedSnapshot.subscribe((snapshot) => {
      this.updateUsuarioCollection(snapshot);
    })
  }

  initForm() {
    this.usuarioForm = this.fb.group({
      address: [''],
      email: [''],
      displayName: [''],
      firstName: [''],
      lastName: [''],
      phone: [''],
      photoURL: [''],
      rol: ['', [Validators.required]],
      uid: ['', [Validators.required]],
    })
  }

  async add() {
    this.submitted = true
    if (this.usuarioModel.displayName.trim()) {
      if (this.usuarioModel.id) {
        await this.firebaseService.updateUsuario(
          this.usuarioModel.uid,
          this.usuarioModel.email,
          this.usuarioModel.firstName,
          this.usuarioModel.lastName,
          this.usuarioModel.displayName,
          this.usuarioModel.phone,
          this.usuarioModel.address,
          this.usuarioModel.photoURL,
          this.usuarioModel.rol,
        )
        this.visible = false
      } else {
        const {
          address,
          email,
          firstName,
          lastName,
          displayName,
          phone,
          photoURL,
          rol,
          uid
        } = this.usuarioModel;
        await this.firebaseService.addUsuario(address, email, displayName, firstName, lastName, phone, photoURL, rol, uid);
        this.visible = false
        this.usuarioForm.reset()
      }
    }

  }

  async get() {
    this.firebaseService.getusuarios().subscribe(data =>{
      this.usuarioCollectionData = data
      this.loading = false
    })
  }

  updateUsuarioCollection(snapshot: QuerySnapshot<DocumentData>) {
    this.usuarioCollectionData = [];
    snapshot.docs.forEach((element) => {
      this.usuarioCollectionData.push({ ...element.data(), id: element.id });
    })
    this.loading = false
  }

  async delete(docId: any) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar la cueta  '+ docId.displayName + '?',
      header: 'Confirmacion',
      icon: 'pi pi-exclamation-triangle',
      
      accept: () => {
        
          this.firebaseService.deleteUsuario(docId.uid);
      }
  });
  }

  async update(docId: string, firstName: string, lastName: string, displayName: string, email: HTMLInputElement, phone: string, address: string, photoURL: string, rol: HTMLInputElement) {
    await this.firebaseService.updateUsuario(docId, firstName, lastName, displayName, email.value, phone, address, photoURL, rol.value);
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


excel(){
  this.Excel.usuarios(this.usuarioCollectionData)
}

  openNew() {
    this.usuarioModel = { uid: '', firstName: '', lastName: '', displayName: '', email: '', phone: '', address: '', photoURL: '', rol: '' }
    this.visible = true;

  }
  hideDialog() {
    this.visibleDe = false;
    this.visible = false;
    this.submitted = false;
  }

  editar(usuario) {
    this.usuarioModel = { ...usuario }
    this.visible = true
  }
}
