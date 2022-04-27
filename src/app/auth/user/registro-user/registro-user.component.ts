import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, getAuth  } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/services/error.service';

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
              private _errorService: ErrorService) {
    this.registerForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repetirPassword: ['' ],
    },{validator: this.checkPassword})
  }

  ngOnInit(): void {
  }

  
  checkPassword(group: FormGroup): any {
    const pass = group.controls.password?.value;
    const confirmPassword = group.controls.repetirPassword?.value;
    return pass === confirmPassword ? null : { notSame: true };
  }

  registerUser(value: any) {
    this.loading = true;
    createUserWithEmailAndPassword(this.auth, value.usuario, value.password)
      .then((userCredential) => {
        const auth = getAuth();
        sendEmailVerification(auth.currentUser);
        const user = userCredential.user;
        this.toastr.success('Enviamos un correo electrónico para verificar su cuenta','Registrados correctamente');
        this.router.navigate(['/login']);
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
