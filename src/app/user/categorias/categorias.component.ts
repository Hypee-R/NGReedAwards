import { Component, OnInit } from '@angular/core';
import { getFirestore, provideFirestore, orderBy } from '@angular/fire/firestore';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { query } from 'firebase/firestore';
import { ConvocatoriasService } from 'src/app/services/convocatoria.service';
// import { CategoriasService } from "./shared/categorias.service";
import { CategoriasService } from '../../services/categorias.service';
// providers: [CategoriasService]

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

  categorias: any;
  convocatorias: any;
  constructor(
    private categoriasService: CategoriasService,
    private convocatoriasService: ConvocatoriasService
  ) {
    this.getCategorias();
    this.getConvocatorias();
   }

  ngOnInit(): void {
  }

  async getCategorias(){
    this.categoriasService.getCategorias().subscribe( (data) => {
      this.categorias = data;
      console.log('data categorias ', this.categorias);
    });
  }

  async getConvocatorias(){
    this.convocatoriasService.getConvocatorias().subscribe( (data) => {
      this.convocatorias = data;
      console.log('data convocatorias ', this.categorias);
    });
  }


}
