import { Serializer } from '@angular/compiler';
import { Component, Input,Output, OnInit,EventEmitter, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CategoriaModel } from 'src/app/models/categoria.model';
import { FileItem } from 'src/app/models/img.model';


export class boleto{
  idLugar: String;
  precio: string;
    constructor(){
    this.idLugar = "";
    this.precio = '';
  
  }
}

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {
  @Input() boletosSeleccionados: any;
  @Output() fetchNominaciones: EventEmitter<boolean> = new EventEmitter<boolean>()
  
  cols: any[];
  boletos: boleto[]=[];
  boleto:boleto={idLugar:"A1",precio:"547 USD"}
  public grabber = false;
  constructor() { }
  total=0

  ngOnInit(): void {
    console.log(this.boletosSeleccionados)
    this.llenarTabla()
    this.cols = [
      {field: 'idLugar', header: 'Lugar' },
      { field: 'precio', header: 'Precio' },
  ];
  }
  ngOnDestroy() {
   console.log("sali")
   this.fetchNominaciones.emit(true)       
  }
  llenarTabla(){

    this.boletos=this.boletosSeleccionados
    this.total=this.boletos.length*575

    
  }
  vaciarDatos(){  
   
  }
  fetchNominacion(){
   
    console.log("actualizar")
  }

}
