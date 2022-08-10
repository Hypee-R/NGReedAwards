import { Component, OnInit } from '@angular/core';
import { Auth, getAuth, sendPasswordResetEmail} from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css']
})
export class RecuperarPasswordEventoComponent implements OnInit {
  recuperarForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder,
              private auth: Auth,
              private router: Router,
              private toastr: ToastrService,
              private _errorService: ErrorService) {
    this.recuperarForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.email]],
    })
  }

  ngOnInit(): void {
  }
  recuperarPassword() {
    const correo = this.recuperarForm.get('usuario')?.value;
    this.loading = true;

    const auth = getAuth();
    sendPasswordResetEmail(auth, correo)
      .then(() => {
        this.toastr.info('Enviamos un correo electrónico para reestablecer su contraseña', 'Recuperar contraseña');
        this.router.navigate(['/reedevento/login']);
      }
      )
      .catch((error) => {
        this.recuperarForm.reset();
        this.loading = false;
        const errorCode = error.code;
        const errorMessage = error.message;
        this.toastr.error(this._errorService.error(error.code),'Oops, error');
      }
      )
  }

}
