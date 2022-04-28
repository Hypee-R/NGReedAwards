import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-mis-nominaciones',
  templateUrl: './mis-nominaciones.component.html',
  styleUrls: ['./mis-nominaciones.component.css']
})
export class MisNominacionesComponent implements OnInit {

  nominacionForm: FormGroup;
  submitted: boolean;
  categorias: any;
  paises: any;
  item$: Observable<any>;
  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private paisesService: PaisesService
  ) {
    this.getCategorias();
    this.getPaises();
  }

  ngOnInit(): void {
    this.initForm();
  }

  getCategorias(){
    const categoriasCollection = collection(this.firestore, 'categorias');
    collectionData(categoriasCollection).subscribe( (data) => {
      this.categorias = data;
      console.log('data categorias ', this.categorias);
    });
  }

  getPaises(){
      this.paisesService.getPaises().subscribe( (data: any) => {
          if(data.length > 0){
            this.paises = data.sort((a, b) => a.name.common - b.name.common);
            console.log('data content paises ordenados', this.paises);
          }
      });
  }

  initForm(){
    this.nominacionForm = this.fb.group({
      titulo: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      nominado: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      fileLogoEmpresa: ['', [Validators.required]],
      organizacion: ['', [Validators.required]],
      responsable: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      rsInstagram: ['' ],
      rsTwitter: ['' ],
      rsFacebook: ['' ],
      rsYoutube: ['' ],
      fileCesionDerechos: ['', [Validators.required]],
      fileCartaIntencion: ['', [Validators.required]],
    })
  }

  crearNominacion(){
    this.submitted = true;
    console.log('form data nominacion ', this.nominacionForm);

  }

}
