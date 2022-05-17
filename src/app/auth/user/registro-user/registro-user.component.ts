import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, getAuth  } from '@angular/fire/auth';
import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/services/error.service';
import { VariablesService } from '../../../services/variablesGL.service';

@Component({
  selector: 'app-registro-user',
  templateUrl: './registro-user.component.html',
  styleUrls: ['./registro-user.component.css']
})
export class RegistroUserComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;



  constructor(private fb: FormBuilder,
              private auth: Auth,
              private router: Router,
              private toastr: ToastrService,
              private _errorService: ErrorService,
              private variablesGL: VariablesService) {
    this.registerForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repetirPassword: ['' ],
    },{validator: this.variablesGL.checkPassword})
  }

  ngOnInit(): void {
  }




  registerUser(value: any) {
    this.loading = true;
    createUserWithEmailAndPassword(this.auth, value.usuario, value.password)
      .then(async (userCredential) => {
        const auth = getAuth();
        sendEmailVerification(auth.currentUser);
        const user = userCredential.user;
        this.toastr.success('Enviamos un correo electrónico para verificar su cuenta, por favor revise su coreo de spam o bandeja de entrada','Registrados correctamente');
        this.router.navigate(['/portal/login']);
        const db = getFirestore();


        await setDoc(doc(db, 'usuarios', user.uid),{
            uid: user.uid,
            email: user.email,
            firstName: '',
            lastName: '',
            displayName: '',
            phone: '',
            address: '',
            photoURL: '',
            rol: 'user'
        });

      })
      .catch((error) => {
        this.registerForm.reset();
        this.loading = false;
        const errorCode = error.code;
        const errorMessage = error.message;
        this.toastr.error(this._errorService.error(error.code),'Oops, error');
      })
  }


  // error (code: string): string {
  //   switch (code) {
  //     case 'auth/email-already-in-use':
  //       return 'El email ya está en uso';
  //     case 'auth/invalid-email':
  //       return 'El email no es válido';
  //     case 'auth/operation-not-allowed':
  //       return 'La operación no está permitida';
  //     case 'auth/weak-password':
  //       return 'La contraseña es débil';
  //     default:
  //       return 'Ocurrió un error desconocido';
  //   }
  // }

}
