import { Component, OnInit } from '@angular/core';
import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { JuesesService } from 'src/app/services/jueses.service';
import { ExcelService } from 'src/app/services/excel.service';
import { NgStyle } from '@angular/common';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-jueces',
  templateUrl: './jueces.component.html',
  styleUrls: ['./jueces.component.css']
})
export class JuecesComponent implements OnInit {
  jueses: any;
  juesModel: any
  juesForm: FormGroup;

  juesesCollectiondata: { id: string, name: string }[] | any = [];

  submitted: boolean = false
  visible: boolean = false

  visibleDe:boolean = false;
  id:any;
  constructor(
    private firestore: JuesesService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private exporExcel: ExcelService,
    private confirmationService: ConfirmationService
  ) {

  }

  ngOnInit(): void {
    this.initForm();
    this.firestore.obsr_UpdatedSnapshot.subscribe((snapshot) => {
      this.updatejuesesCollection(snapshot);
    })
  }
  initForm() {
    this.juesForm = this.fb.group({
      name: ['', [Validators.required]],
      // fechaInicio: ['', [Validators.required]],
      // fechaFin: ['', [Validators.required]],

    })
  }
  async get() {
    const snapshot = await this.firestore.getJueses();
    this.updatejuesesCollection(snapshot);
  }
  async add() {
    this.submitted = true;
    // this.visible = false
    // if (this.convocatoriaForm.valid) {
    if (this.juesModel.name.trim()) {
      if (this.juesModel.id) {
        this.firestore.updatejueses(this.juesModel.name, this.juesModel.id)
        this.visible = false

      } else {
        const { name } = this.juesModel;
        await this.firestore.addJues(name);
        // this.convocatoria.titulo = "";
        // this.convocatoria.fechaInicio = "";
        // this.convocatoria.fechaFin = "";
        this.visible = false
        this.juesForm.reset()


      }
    }

    // } else {

    //   this.toastr.info('Todos los Campos son requeridos!!', 'Espera');
    //   this.visible = true
    //   this.convocatoriaCollectiondata.reset()
    // }
    // this.convocatoriaModelDialog = false;
    // this.convocatoriaModel;

  }
  async delete(docId: any) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar jues  '+ docId.name + '?',
      header: 'Confirmacion',
      icon: 'pi pi-exclamation-triangle',
      
      accept: () => {
        
          this.firestore.deletejueses(docId.id);
      }
  });
  }
  updatejuesesCollection(snapshot: QuerySnapshot<DocumentData>) {
    this.juesesCollectiondata = [];
    snapshot.docs.forEach((student) => {
      this.juesesCollectiondata.push({ ...student.data(), id: student.id });
    })
  }
  editar(jues: any) {
    this.visible = true
    this.juesModel = { ...jues }

  }
  openNew() {
    this.juesModel = { name: '' }
    this.visible = true;
    this.submitted = false

  }
  hideDialog() {
    this.visibleDe = false;
    this.visible = false;
    this.submitted = false;
  }

}
