import { Component, OnInit ,EventEmitter,Output,Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { ContactoService } from 'src/app/services/contacto.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  @Output() fetchNominaciones: EventEmitter<boolean> = new EventEmitter<boolean>()
  @Input() accion: string;
  contactoForm: FormGroup;
  submitted: boolean;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private contactoService: ContactoService,
  
    private variablesGL: VariablesService,


  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.contactoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      mensaje: ['', [Validators.required]],
    })
  }

  

   
  saveDataNominacion(){
      this.contactoService.addNominacion({
        nombre: this.contactoForm.get('nombre').value,
        correo: this.contactoForm.get('correo').value,
        mensaje: this.contactoForm.get('mensaje').value,
        uid: JSON.parse(localStorage.d).uid
      });
      this.variablesGL.endProcessNominacion.subscribe(endProcessNominacion => {
        if(endProcessNominacion != '' && endProcessNominacion != null){
          this.toastr.success('Conctacto creada con exito!!', 'Success');
          this.submitted = false;
          this.contactoForm.reset();
          console.log("END PROCESS CREATE");

          this.variablesGL.endProcessCargaCompleta.next(null);
          this.variablesGL.endProcessNominacion.next(null);
          this.fetchNominaciones.emit(true);
        }else if(endProcessNominacion == ''){
          this.toastr.error('Hubo un error al guardar la nominacion!', 'Error');
          this.submitted = false;
        }
      });

    }

 

}

