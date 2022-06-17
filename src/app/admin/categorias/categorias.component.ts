import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CategoriasService } from 'src/app/services/categorias.service';
import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/services/excel.service';
import { ConfirmationService } from 'primeng/api';

// import { Subject } from 'rxjs/Subject';
@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {


  categoriaCollectiondata: any = [
    {id:'', nombre:''}
  ];
  categoriaForm: FormGroup;
  submitted: boolean;
  loading: boolean =true

  visible: boolean;
  categoriaModelDialog: boolean;
  categoriaModel: any;
  idModel: any = [
    {id:'', nombre:''}
  ];;

  excel:any;



  visibleDe:boolean= false;
  id: any;




  constructor(

    private firebaseService: CategoriasService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private exporExcel: ExcelService,
    private confirmationService: ConfirmationService
  ) {

  }


  ngOnInit(): void {
    this.initForm();
    this.get();
    this.firebaseService.obsr_UpdatedSnapshot.subscribe((snapshot) => {
      this.updatecategoriaCollection(snapshot);
    })
  }

  initForm() {
    this.categoriaForm = this.fb.group({
      id: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      // fechaFin: ['', [Validators.required]],

    })
  }

  async add() {
    this.submitted = true;
    // this.visible = false
    if (this.categoriaForm.valid) {

          const { id,nombre} = this.categoriaModel;
          await this.firebaseService.addcategoria(id ,nombre);
          console.log('dd');
          this.categoriaForm.reset()
          // this.categoria.titulo = "";
          // this.categoria.fechaInicio = "";
          // this.categoria.fechaFin = "";
this.visible = false


    } else {

      this.toastr.info('Todos los Campos son requeridos!!', 'Espera');
      this.visible = true
      // this.categoriaCollectiondata.reset()
    }
    // this.convocatoriaModelDialog = false;
    // this.convocatoriaModel;
this.submitted = false
  }


  async get() {
    this.firebaseService.getCategorias().subscribe((data) => {
      this.categoriaCollectiondata = data;
      this.loading= false
    });
    //this.updatecategoriaCollection(snapshot);
  }


  updatecategoriaCollection(snapshot: QuerySnapshot<DocumentData>) {
    this.categoriaCollectiondata = [];
    snapshot.docs.forEach((student) => {
      this.categoriaCollectiondata.push({ ...student.data(), id: student.id });
    })
  }

  async delete(docId: any) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar la ctegoria  '+ docId.nombre + '?',
      header: 'Confirmacion',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {

          this.firebaseService.deletecategoria(docId.id);
      }
  });
  }
edit: boolean = false
  editar(categoria: any) {
    this.categoriaModel = { ...categoria }
    this.edit = true


    // console.log(this.categoriaModel);
    // console.log(this.id.id);


  }
  update() {
this.firebaseService.updatecategoria(this.categoriaModel.id, this.categoriaModel.nombre);
this.edit= false
  }



  Excel() {

    this.exporExcel.categoria(this.categoriaCollectiondata)
    ;


  }

  openNew() {
    this.categoriaModel = { id: '', nombre: ''}
    this.visible = true;
    this.submitted = false;
    this.categoriaForm.reset()

  }
  hideDialog() {
    this.visibleDe = false;
    this.visible = false;
    this.edit = false
    this.submitted = false;
  }






  import(key:any){
    //  this.firebaseService.addcategoria(this.keys);
    console.log(key);

  }
}
