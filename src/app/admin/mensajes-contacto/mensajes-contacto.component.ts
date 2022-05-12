import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import { ContactoService } from 'src/app/services/contacto.service';

@Component({
  selector: 'app-mensajes-contacto',
  templateUrl: './mensajes-contacto.component.html',
  styleUrls: ['./mensajes-contacto.component.css']
})
export class MensajesContactoComponent implements OnInit {
  contacto = {
    id: '',
    nombre: ''
  }

  contactoCollectiondata: { id: string, titulo: string, fechaInicio: Date, fechaFin: Date }[] | any = [];
  contactoForm: FormGroup;
  submitted: boolean;
  constructor(private firebaseService: ContactoService,private fb: FormBuilder, private toastr: ToastrService,) {
    
   }

  ngOnInit(): void {
    this.initForm();
    
    this.get();
    this.firebaseService.obsr_UpdatedSnapshot.subscribe((snapshot) => {
      this.updatecontactoCollection(snapshot);
    })
  }

  initForm(){
    this.contactoForm = this.fb.group({
      id: ['', [Validators.required]],
      nombre: ['', [Validators.required]],


    })
  }
 
  async add() {
    this.submitted = true;

    if(this.contactoForm.valid){

   const { id, nombre} = this.contacto;
    await this.firebaseService.addcontacto(id, nombre);
    this.contacto.id = "";
    this.contacto.nombre = "";

    }else{

      this.toastr.info('Todos los Campos son requeridos!!', 'Espera');

    }



  }

  async get() {
    const snapshot = await this.firebaseService.getcontactos();
    //this.updatecontactoCollection(snapshot);
  }

  updatecontactoCollection(snapshot: QuerySnapshot<DocumentData>) {
    this.contactoCollectiondata = [];
    snapshot.docs.forEach((student) => {
      this.contactoCollectiondata.push({ ...student.data(), id: student.id });
    })
  }

  async delete(docId: string) {
    await this.firebaseService.deletecontacto(docId);
  }

  async update(docId: string, nombre: HTMLInputElement) {
    await this.firebaseService.updatecontacto(docId, nombre.value);
  }
}