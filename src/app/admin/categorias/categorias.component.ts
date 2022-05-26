import { Component, OnInit } from '@angular/core';
import { CategoriasService } from 'src/app/services/categorias.service';
import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/services/excel.service';


@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categoria = {
    titulo: '',
    fechaInicio: '',
    fechaFin: ''
  }

  categoriaCollectiondata: { id: any, nombre:any }[] | any = [];
  categoriaForm: FormGroup;
  submitted: boolean;

  visible: boolean;
  categoriaModelDialog: boolean;
  categoriaModel: any;
  idModel: any;
  constructor(

    private firebaseService: CategoriasService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private exporExcel: ExcelService
    ) {
firebaseService.getid().subscribe(data =>{
  console.log(data);
  
})
  }


  ngOnInit(): void {
    this.initForm();
this.getid();
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
    // if (this.categoriaForm.valid) {
      if (this.categoriaModel.nombre.trim()) {
        if (this.categoriaModel.id) {
          // this.firebaseService.updatecategoria( this.categoriaModel.nombre, this.categoriaModel.id)
          this.visible = false
          console.log('ss');
          
          
        } else {
          const { id, nombre } = this.categoriaModel;
          console.log(id);
          
          // await this.firebaseService.addcategoria(id, nombre);
          // this.categoria.titulo = "";
          // this.categoria.fechaInicio = "";
          // this.categoria.fechaFin = "";
this.visible = false

          
        }
      }

    // } else {

    //   this.toastr.info('Todos los Campos son requeridos!!', 'Espera');
    //   this.visible = true
    //   this.categoriaCollectiondata.reset()
    // }
    // this.categoriaModelDialog = false;
    // this.categoriaModel;

  }

  // async get() {
  //   const snapshot = await this.firebaseService.getCategorias();
  //   // this.updatecategoriaCollection(snapshot);
    
  // }
  async get() {
    this.firebaseService.getCategorias().subscribe( (data) => {
      this.categoriaCollectiondata = data;
      console.log('data categorias ', this.categoriaCollectiondata);
      // this.loading = false;
    });
    //this.updatecategoriaCollection(snapshot);
  }
  getid(){
    this.firebaseService.getid()
  }

  updatecategoriaCollection(snapshot: QuerySnapshot<DocumentData>) {
    this.categoriaCollectiondata = [];
    snapshot.docs.forEach((student) => {
      this.categoriaCollectiondata.push({ ...student.data(), id: student.id });
    })
  }

  async delete(docId: string) {
    // console.log(this.categoriaModel.id);
    // console.log(this.categoriaModel.id);
    
    await this.firebaseService.deletecategoria(docId);
  }

  // async update(docId: string, titulo: HTMLInputElement, fechaInicio: HTMLInputElement,fechaFin: HTMLInputElement) {
  //   await this.firebaseService.updatecategoria(docId, titulo.value, fechaInicio.value,fechaFin.value);
  // }
  edit: boolean = false;
  editar(categoria: any) {
    // this.visible = true
    this.categoriaModel = { ...categoria }
console.log(this.categoriaModel);
// console.log(this.id.id);


  }
  update(id: any) {

  }



  Excel() {
    this.exporExcel.convoc(this.categoriaCollectiondata)

  }

  openNew() {
    this.categoriaModel = { id:'', nombre:'' }
    this.visible = true;
    
  }
  hideDialog() {
    // this.ContactoModelDialog = false;
    this.visible = false;
    this.submitted = false;
  }
}