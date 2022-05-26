import { Component, OnInit } from '@angular/core';
import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import { ConvocatoriasService } from 'src/app/services/convocatoria.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/services/excel.service';
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

  visible: boolean;
  convocatoriaModelDialog: boolean;
  convocatoriaModel: any;



  constructor(
    private firebaseService: ConvocatoriasService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private exporExcel: ExcelService
    ) {

  }


  ngOnInit(): void {
    this.initForm();

    this.get();
    this.firebaseService.obsr_UpdatedSnapshot.subscribe((snapshot) => {
      this.updateConvocatoriaCollection(snapshot);
    })
  }

  initForm() {
    this.convocatoriaForm = this.fb.group({
      titulo: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],

    })
  }

  async add() {
    this.submitted = true;
    // this.visible = false
    // if (this.convocatoriaForm.valid) {
      if (this.convocatoriaModel.titulo.trim()) {
        if (this.convocatoriaModel.id) {
          this.firebaseService.updateConvocatoria(this.convocatoriaModel.titulo, this.convocatoriaModel.fechaInicio, this.convocatoriaModel.fechaFin, this.convocatoriaModel.id)
          this.visible = false
          
        } else {
          const { titulo, fechaInicio, fechaFin } = this.convocatoriaModel;
          await this.firebaseService.addConvocatoria(titulo, fechaInicio, fechaFin);
          // this.convocatoria.titulo = "";
          // this.convocatoria.fechaInicio = "";
          // this.convocatoria.fechaFin = "";
this.visible = false

          
        }
      }

    // } else {

    //   this.toastr.info('Todos los Campos son requeridos!!', 'Espera');
    //   this.visible = true
    //   this.convocatoriaCollectiondata.reset()
    // }
    this.convocatoriaModelDialog = false;
    this.convocatoriaModel;

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

  // async update(docId: string, titulo: HTMLInputElement, fechaInicio: HTMLInputElement,fechaFin: HTMLInputElement) {
  //   await this.firebaseService.updateConvocatoria(docId, titulo.value, fechaInicio.value,fechaFin.value);
  // }
  edit: boolean = false;
  editar(convocatoria: any) {
    this.visible = true
    this.convocatoriaModel = { ...convocatoria }

  }
  update(id: any) {

  }



  Excel() {
    this.exporExcel.convoc(this.convocatoriaCollectiondata)

  }

  openNew() {
    this.convocatoriaModel = { titulo: '', fechaInicio: '', fechaFin: '' }
    this.visible = true;
    
  }
  hideDialog() {
    // this.ContactoModelDialog = false;
    this.visible = false;
    this.submitted = false;
  }
}
