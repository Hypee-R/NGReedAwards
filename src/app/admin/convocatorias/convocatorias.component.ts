import { Component, OnInit } from '@angular/core';
import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import { ConvocatoriasService } from 'src/app/services/convocatoria.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-convocatorias',
  templateUrl: './convocatorias.component.html',
  styleUrls: ['./convocatorias.component.css']
})
export class ConvocatoriasComponent implements OnInit {
  convocatoria = {
    titulo: '',
    fechaInicio: '',
    fechaFin: ''
  }

  convocatoriaCollectiondata: { id: string, titulo: string, fechaInicio: Date, fechaFin: Date }[] | any = [];
  convocatoriaForm: FormGroup;
  submitted: boolean;
  constructor(private firebaseService: ConvocatoriasService,private fb: FormBuilder, private toastr: ToastrService,) {
    
   }


  ngOnInit(): void {
    this.initForm();
    
    this.get();
    this.firebaseService.obsr_UpdatedSnapshot.subscribe((snapshot) => {
      this.updateConvocatoriaCollection(snapshot);
    })
  }

  initForm(){
    this.convocatoriaForm = this.fb.group({
      titulo: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],

    })
  }
  
  async add() {
    this.submitted = true;

    if(this.convocatoriaForm.valid){

   const { titulo, fechaInicio,fechaFin } = this.convocatoria;
    await this.firebaseService.addConvocatoria(titulo, fechaInicio,fechaFin);
    this.convocatoria.titulo = "";
    this.convocatoria.fechaInicio = "";
    this.convocatoria.fechaFin = "";
    }else{

      this.toastr.info('Todos los Campos son requeridos!!', 'Espera');

    }

  }

  async get() {
    const snapshot = await this.firebaseService.getConvocatoria();
    this.updateConvocatoriaCollection(snapshot);
  }

  updateConvocatoriaCollection(snapshot: QuerySnapshot<DocumentData>) {
    this.convocatoriaCollectiondata = [];
    snapshot.docs.forEach((student) => {
      this.convocatoriaCollectiondata.push({ ...student.data(), id: student.id });
    })
  }

  async delete(docId: string) {
    await this.firebaseService.deleteConvocatoria(docId);
  }

  async update(docId: string, titulo: HTMLInputElement, fechaInicio: HTMLInputElement,fechaFin: HTMLInputElement) {
    await this.firebaseService.updateConvocatoria(docId, titulo.value, fechaInicio.value,fechaFin.value);
  }

  
}
