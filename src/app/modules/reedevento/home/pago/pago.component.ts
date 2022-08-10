import { Serializer } from '@angular/compiler';

import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CategoriaModel } from 'src/app/models/categoria.model';
import { FileItem } from 'src/app/models/img.model';
import { SafeUrl } from "@angular/platform-browser"
import { PrintingService } from 'src/app/services/Print.service';

export class boleto {
  idLugar: String;
  precio: String;
  disponible:Boolean;
    constructor(){
    this.idLugar = "";
    this.precio = '';
    this.disponible=false;
  
  }
}

declare var paypal;
@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;
  @ViewChild('printEl') printEl: ElementRef;

  @Input() boletosSeleccionados: any;
  @Output() fetchNominaciones: EventEmitter<boolean> = new EventEmitter<boolean>()

  cols: any[];
  boletos: boleto[]=[];
  boleto:boleto={idLugar:"A1",precio:"547 USD",disponible:true}
  public grabber = false;
  constructor(    private printingService: PrintingService) { }
  total = 0
  //QR
  public myAngularxQrCode: string = "";
  public qrCodeDownloadLink: SafeUrl = "";

  data = [
    'Todal de la compra:' + this.boletos.toString,
    'Total de la compra:'+   this.total.toString,
    'email: john@doe.com',
    'hobby: coding',
  ]

  dataToString = JSON.stringify(this.data);



  ngOnInit(): void { paypal
    .Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: 'Reservacion ReedAwards 2022',
              amount     :{
                moneda: 'US',
                value        : this.total
              }
            }
          ]
        })
      },
      onApprove: async (data, actions) => {
        console.log(data)
        const order = await actions.order.capture();
        console.log(order.id);
        console.log(order.status);
        console.log(order.purchase_units);


        // this.nominacionForm.controls['statuspago'].setValue("Pago Realizado");
        // this.nominacionForm.controls['idpago'].setValue(order.id);


      },
      onError: err =>{
        // this.nominacionForm.controls['statuspago'].setValue("");
        // this.nominacionForm.controls['idpago'].setValue("");

        console.log(err);

      }
    })
    .render( this.paypalElement.nativeElement );
  

    console.log(this.boletosSeleccionados)
    this.llenarTabla()
    this.cols = [
      { field: 'idLugar', header: 'Lugar' },
      { field: 'precio', header: 'Precio' },
    ];
  }

  ngOnDestroy() {
    console.log("sali")
    this.fetchNominaciones.emit(true)
  }
  llenarTabla() {

    this.boletos = this.boletosSeleccionados
    this.total = this.boletos.length * 575


  }
  vaciarDatos() {

  }
  fetchNominacion() {

    console.log("actualizar")
  }

   // Re-enable, when a method to download images has been implemented
   onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }
}
