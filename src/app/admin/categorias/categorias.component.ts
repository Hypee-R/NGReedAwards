import { Component, OnInit } from '@angular/core';
import { CategoriasService } from 'src/app/services/categorias.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DocumentData, QuerySnapshot } from 'firebase/firestore';

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

  categoriaCollectiondata: { id: string, titulo: string, fechaInicio: Date, fechaFin: Date }[] | any = [];
  categoriaForm: FormGroup;
  submitted: boolean;
  constructor(private firebaseService: CategoriasService,private fb: FormBuilder, private toastr: ToastrService,) {
    
   }


  ngOnInit(): void {
    this.initForm();
    
    this.get();
    this.firebaseService.obsr_UpdatedSnapshot.subscribe((snapshot) => {
      this.updatecategoriaCollection(snapshot);
    })
  }

  initForm(){
    this.categoriaForm = this.fb.group({
      titulo: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: ['', [Validators.required]],

    })
  }
  
  async add() {
    this.submitted = true;

    if(this.categoriaForm.valid){

   const { titulo, fechaInicio,fechaFin } = this.categoria;
    await this.firebaseService.addcategoria(titulo, fechaInicio,fechaFin);
    this.categoria.titulo = "";
    this.categoria.fechaInicio = "";
    this.categoria.fechaFin = "";
    }else{

      this.toastr.info('Todos los Campos son requeridos!!', 'Espera');

    }



  }

  async get() {
    const snapshot = await this.firebaseService.getCategorias();
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

  async update(docId: string, titulo: HTMLInputElement, fechaInicio: HTMLInputElement,fechaFin: HTMLInputElement) {
    await this.firebaseService.updatecategoria(docId, titulo.value, fechaInicio.value,fechaFin.value);
  }
}