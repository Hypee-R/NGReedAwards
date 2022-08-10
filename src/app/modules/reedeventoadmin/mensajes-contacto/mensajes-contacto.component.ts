import { Component, OnInit } from '@angular/core';

import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import { ContactoModel } from 'src/app/models/contacto.model';
import { ContactoService } from 'src/app/services/contacto.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

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

  ContactoModelDialog: boolean;
  ContactoModels: any[] = [];

  ContactoModel: ContactoModel;
  //convocatoriaCollectiondata: { id: string, titulo: string, fechaInicio: Date, fechaFin: Date }[] | any = [];
  selectedContactoModels: ContactoModel[];
  submitted: boolean;

  // contactoForm: FormGroup;
  // submitted: boolean;
  constructor(private firebaseService: ContactoService, private messageService: MessageService, private confirmationService: ConfirmationService ) {
    
   }

  ngOnInit(): void {

    this.get();
    this.firebaseService.obsr_UpdatedSnapshot.subscribe((snapshot) => {
      this.updateConvocatoriaCollection(snapshot);
    })
  
  
  }

  async get() {
    const snapshot = await this.firebaseService.getContactos();
    this.updateConvocatoriaCollection(snapshot);
  }

  
  updateConvocatoriaCollection(snapshot: QuerySnapshot<DocumentData>) {
    this.ContactoModels = [];
    snapshot.docs.forEach((mensaje) => {
      this.ContactoModels.push({ ...mensaje.data(), id: mensaje.id });
    })
  }


    // this.initForm();
    
    // this.get();
    // this.firebaseService.obsr_UpdatedSnapshot.subscribe((snapshot) => {
    //   this.updatecontactoCollection(snapshot);
    // })
  

  // initForm(){
  //   this.contactoForm = this.fb.group({
  //     id: ['', [Validators.required]],
  //     nombre: ['', [Validators.required]],


  //   })
  // }
 
  // async add() {
  //   this.submitted = true;

  //   if(this.contactoForm.valid){

  //  const { id, nombre} = this.contacto;
  //   await this.firebaseService.addcontacto(id, nombre);
  //   this.contacto.id = "";
  //   this.contacto.nombre = "";

  //   }else{

  //     this.toastr.info('Todos los Campos son requeridos!!', 'Espera');

  //   }



  // }

  // async get() {
  //   const snapshot = await this.firebaseService.getcontactos();
  //   //this.updatecontactoCollection(snapshot);
  // }

  // updatecontactoCollection(snapshot: QuerySnapshot<DocumentData>) {
  //   this.contactoCollectiondata = [];
  //   snapshot.docs.forEach((student) => {
  //     this.contactoCollectiondata.push({ ...student.data(), id: student.id });
  //   })
  // }

  // async delete(docId: string) {
  //   await this.firebaseService.deletecontacto(docId);
  // }

  // async update(docId: string, nombre: HTMLInputElement) {
  //   await this.firebaseService.updatecontacto(docId, nombre.value);
  // }


  openNew() {
    this.ContactoModel={nombre:'',correo:'',telefono:'',mensaje:''};
    this.submitted = false;
    this.ContactoModelDialog = true;
}

// deleteSelectedContactoModels() {
//     this.confirmationService.confirm({
//         message: 'Are you sure you want to delete the selected ContactoModels?',
//         header: 'Confirm',
//         icon: 'pi pi-exclamation-triangle',
//         accept: () => {
//             this.ContactoModels = this.ContactoModels.filter(val => !this.selectedContactoModels.includes(val));
//             this.selectedContactoModels = null;
//             this.messageService.add({severity:'success', summary: 'Successful', detail: 'ContactoModels Deleted', life: 3000});
//         }
//     });
// }

editContactoModel(ContactoModel: ContactoModel) {
    this.ContactoModel = {...ContactoModel};
    this.ContactoModelDialog = true;
}

deleteContactoModel(ContactoModel: ContactoModel) {
    this.confirmationService.confirm({
        message: '¿Está seguro de que desea eliminar el mensaje de  '+ ContactoModel.nombre + '?',
        header: 'Confirmacion',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            console.log("id firebase"+ContactoModel.id)

            this.ContactoModels = this.ContactoModels.filter(val => val.id !== ContactoModel.id);
            this.ContactoModel;
            this.firebaseService.deletecontacto(ContactoModel.id);
            // this.messageService.add({severity:'success', summary: 'Successful', detail: 'Mensaje Eliminado', life: 3000});
        }
    });
}

hideDialog() {
    this.ContactoModelDialog = false;
    this.submitted = false;
}

saveContactoModel() {
    this.submitted = true;

    if (this.ContactoModel.nombre.trim()) {
        if (this.ContactoModel.id) {
            // this.ContactoModels[this.findIndexById(this.ContactoModel.id)] = this.ContactoModel;                
            // this.messageService.add({severity:'success', summary: 'Successful', detail: 'Mensaje Actualizado', life: 3000});
            this.firebaseService.updatecontacto(this.ContactoModel.id,this.ContactoModel.correo,this.ContactoModel.mensaje,this.ContactoModel.nombre);
        }
        else {
           
            // this.ContactoModels.push(this.ContactoModel);
            // this.messageService.add({severity:'success', summary: 'Successful', detail: 'ContactoModel Created', life: 3000});
            this.firebaseService.addcontacto(this.ContactoModel.correo,this.ContactoModel.mensaje,this.ContactoModel.nombre);
        }

        this.ContactoModels = [...this.ContactoModels];
        this.ContactoModelDialog = false;
        this.ContactoModel ;
    }
}

findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.ContactoModels.length; i++) {
        if (this.ContactoModels[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}


}