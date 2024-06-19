import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword,   } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/services/error.service';
import { Router } from '@angular/router';
import { ProfileUser } from 'src/app/models/user';
import { Firestore, collection, getDocs, getFirestore, query, where } from 'firebase/firestore';



@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  userdata: any;
  db: Firestore = getFirestore();

  constructor(private fb: FormBuilder,
              private auth: Auth,
              private toastr: ToastrService,
              private _errorService: ErrorService,
              private router: Router) {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  login() {
    const usuario = this.loginForm.get('usuario').value;
    const password = this.loginForm.get('password').value;
    this.loading = true;
    signInWithEmailAndPassword(this.auth, usuario, password)
      .then(async(userCredential) => {

        if (userCredential.user?.emailVerified) {
          this.toastr.success('Bienvenido', 'Login correcto');
          localStorage.d = JSON.stringify(userCredential.user);
          const querySnapshot =  getDocs(query(collection(this.db, "usuarios/"), where("uid", "==", userCredential.user.uid)));
          (await querySnapshot).forEach((doc) => {
            this.userdata = doc.data();
            console.log("user data",this.userdata);
          })

          localStorage.setItem('user', JSON.stringify(this.userdata));
          var link  = localStorage.getItem('urlanterior')
          //console.log(link)
          switch (this.userdata.rol) {
            case 'user':
              if(link != undefined){
                  this.router.navigate(['/portal/'+link])
                  localStorage.setItem('urlanterior', "");
              }
              else{
                this.router.navigate(['/portal']);
              }
              ///console.log("Entre aqui en el login")


              break;
            case 'admin':
              this.router.navigate(['/admin']);
              break;
          }

          // this.setLocalStorage(userCredential.user);
          //this.router.navigate(['/']);
        } else {
          this.toastr.error('El usuario no ha verificado su cuenta', 'Error');
          this.router.navigate(['/portal/verificarCorreo']);
        }
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
        const errorCode = error.code;
        const errorMessage = error.message;
        this.toastr.error(this._errorService.error(error.code),'Oops, error');
        this.loginForm.reset();
      })
  }


  setLocalStorage(user: any) {
    const usuario: ProfileUser = {
      uid: user.uid,
      email: user.email
    }

    localStorage.setItem('user', JSON.stringify(usuario));
  }


}
