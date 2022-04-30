import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  contactoForm: FormGroup;
  submitted: boolean;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.contactoForm = this.fb.group({
      titulo: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
  
    })
  }

  // async Registracontacto(){
   
  //   this.submitted = true;
  //   console.log('form data nominacion ', this.contactoForm);
  //   if(this.contactoForm.valid){
     
     
  //           this.nominacionService.addNominacion({
  //             titulo: this.contactoForm.get('titulo').value,
  //             categoria: this.contactoForm.get('categoria').value,
  //             uid: JSON.parse(localStorage.d).uid
  //           });

  //           this.variablesGL.endProcessNominacion.subscribe(endProcessNominacion => {
  //             if(endProcessNominacion != ''){
  //               this.toastr.success('Registro  creado con exito!!', 'Success');
  //               this.submitted = false;
  //               this.contactoForm.reset();
              
  //             }else if(endProcessNominacion == ''){
  //               this.toastr.error('Hubo un error al guardar ! :(', 'Error');
  //               this.submitted = false;
  //             }
  //           });
  //         }
  //       }
  //     });
  //   }
  

}

