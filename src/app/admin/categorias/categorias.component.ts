import { Component, OnInit } from '@angular/core';
import { CategoriasService } from 'src/app/services/categorias.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import { Table } from 'primeng/table';
// import { CategoriasService } from "./shared/categorias.service";
import { CategoriaModel } from '../../models/categoria.model';


@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categoria = {
    id: '',
    nombre: ''
  }
  categorias: any;
  loading: boolean = true;
  categoriaCollectiondata: { id: string, titulo: string, fechaInicio: Date, fechaFin: Date }[] | any = [];
  categoriaForm: FormGroup;
  submitted: boolean;

  selectedCategoria: CategoriaModel;



  visible:Boolean = false
  constructor(private firebaseService: CategoriasService,private fb: FormBuilder, private toastr: ToastrService,)
   {
    this.get();
    
   }


  ngOnInit(): void {
    this.initForm();
    
    this.get();
    // this.firebaseService.obsr_UpdatedSnapshot.subscribe((snapshot) => {
    //   this.updatecategoriaCollection(snapshot);
    // })
  }

  initForm(){
    this.categoriaForm = this.fb.group({
      id: ['', [Validators.required]],
      nombre: ['', [Validators.required]],


    })
  }
  
  async add() {
    this.submitted = true;

    if(this.categoriaForm.valid){

   const { id, nombre} = this.categoria;
    await this.firebaseService.addcategoria(id, nombre);
    this.categoria.id = "";
    this.categoria.nombre = "";

    }else{

      this.toastr.info('Todos los Campos son requeridos!!', 'Espera');

    }



  }

  

  async get() {
    this.firebaseService.getCategorias().subscribe( (data) => {
      this.categorias = data;
      // console.log('data categorias ', this.categorias);
      this.loading = false;
    }
    // , err => {
    //   this.categorias = [];
    //   this.loading = false;
    // }
    );
    //this.updatecategoriaCollection(snapshot);
  }

  updatecategoriaCollection(snapshot: QuerySnapshot<DocumentData>) {
    this.categoriaCollectiondata = [];
    snapshot.docs.forEach((student) => {
      this.categoriaCollectiondata.push({ ...student.data(), id: student.id });
    })
  }

  async delete(docId: string) {
    await this.firebaseService.deletecategoria(docId);
  }

  async update(docId: string, nombre: HTMLInputElement) {
    await this.firebaseService.updatecategoria(docId, nombre.value);
  }


    clear(table: Table) {
    table.clear();
  }

// -------


Excel(){

}

openNew(){
this.visible= true
}

editar(categori: any){

}
hideDialog(){

}
}