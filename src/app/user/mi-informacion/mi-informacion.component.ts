import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VariablesService } from '../../services/variablesGL.service';

@Component({
  selector: 'app-mi-informacion',
  templateUrl: './mi-informacion.component.html',
  styleUrls: ['./mi-informacion.component.css']
})
export class MiInformacionComponent implements OnInit {

  formMiInformacion: FormGroup;
  submitedF1: boolean;
  formContrasena: FormGroup;
  submitedF2: boolean;
  constructor(
    private fb: FormBuilder,
    private variablesGL: VariablesService,
  ) { }

  ngOnInit(): void {
    this.initForms();
  }

  initForms(){
    this.formMiInformacion = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern('^((\\+52-?)|0)?[0-9]{10}$')]],
    })

    this.formContrasena = this.fb.group({
      contrasenaActual: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repetirPassword: ['' ],
    },{validator: this.variablesGL.checkPassword})
  }

  updateInfo(){
    this.submitedF1 = true;
    console.log('content form info ', this.formMiInformacion);
      if(this.formMiInformacion.valid){

      }
  }

  updatePassword(){
    this.submitedF2 = true;
    console.log('content form pass ', this.formContrasena);
      if(this.formContrasena.valid){

      }
  }

}
