import { Component, OnInit } from '@angular/core';
import { getFirestore, provideFirestore, orderBy } from '@angular/fire/firestore';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { query } from 'firebase/firestore';
import { Table } from 'primeng/table';
import { ConvocatoriasService } from 'src/app/services/convocatoria.service';
// import { CategoriasService } from "./shared/categorias.service";
import { CategoriasService } from '../../../services/categorias.service';
import { CategoriaModel } from '../../../models/categoria.model';
import { Router } from '@angular/router';
import { VariablesService } from '../../../services/variablesGL.service';
import { ConfigService } from 'src/config/config.service';
// providers: [CategoriasService]

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
  convocatorias: any;
  loading: boolean = true;
  selectedCategoria: CategoriaModel;
  visibleSide: boolean = false;
  accion: string = "";
  constructor(
    private router: Router,
    public configService: ConfigService,
    private variablesGL: VariablesService,
    private categoriasService: CategoriasService,
    private convocatoriasService: ConvocatoriasService,
  ) {
    this.getCategorias();
    //this.getConvocatorias();
   }

  ngOnInit(): void {
    this.getCategorias();

  }

  async getCategorias(){
    this.categoriasService.getCategorias().subscribe( (data) => {
      this.categorias = data;
      console.log('data categorias ', this.categorias);
      this.loading = false;
    }, err => {
      this.categorias = [];
      this.loading = false;
    });
  }

  async getConvocatorias(){
    this.convocatoriasService.getConvocatorias().subscribe( (data) => {
      this.convocatorias = data;
      console.log('data convocatorias ', this.categorias);
    });
  }

  clear(table: Table) {
    table.clear();
  }

  addNominacion(event){
    //console.log('add nominacion event ', event, this.selectedCategoria);
    if(this.configService.Usuario){
      this.variablesGL.preloadCategoria.next(this.selectedCategoria);
      this.accion = 'agregar';
      this.visibleSide = true;
    }else{
      this.router.navigate(["/portal/login"])
    }
  }

  fetchNominacion(){
    this.visibleSide = false;
    this.accion = '';
    this.router.navigate(["/portal/mis-nominaciones"]);
  }


}
