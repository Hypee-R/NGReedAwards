
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { SafeUrl } from "@angular/platform-browser"
import { PrintingService } from 'src/app/services/Print.service';
import {DialogModule} from 'primeng/dialog';
import { LugaresService } from 'src/app/services/lugares.service';
import { timer } from 'rxjs';
export class boleto {
  idLugar: String;
  precio: String;
  comprado:Boolean;
  apartado:Boolean;
  hora:String;
    constructor(){
    this.idLugar = "";
    this.precio = '';
    this.comprado=false;
    this.apartado=false;
    this.hora=""
    
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

  @Input() boletosSeleccionados: any;
  @Output() fetchNominaciones: EventEmitter<boolean> = new EventEmitter<boolean>()

  cols: any[];
  boletos: boleto[]=[];
  boleto:boleto={idLugar:"A1",precio:"547 USD",comprado:false,apartado:false,hora:""}
  public grabber = false;
  constructor(    private printingService: PrintingService, 
    private lugaresService:LugaresService
    ) { }
  total = 0
  //QR
  public qrCodeDownloadLink: SafeUrl = "";
  dataToString:any;
  data: any;
 //Status Pago
  statuspago : boolean = false;
  lugaresAdquiridos : String ;
  codigotiket : String ;
  tiempo=true;
  timeLeft: number = 60;
  time:string=''
  interval;
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
        this.statuspago=true;
      
       
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
  

    //console.log(this.boletosSeleccionados)
    this.llenarTabla();
    this.cols = [
      { field: 'idLugar', header: 'Lugar' },
      { field: 'precio', header: 'Precio' },
    ];
 
    this.tiempo=true
    
    this.showTime()
  }
   showTime(){
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this.lugaresService.cancelarLugar(this.boletosSeleccionados)
        this.tiempo=false
      }
      this.time=this.secondsToString(this.timeLeft)
      
    },1000)

  }

  secondsToString(seconds) {
   
    let minute = Math.floor((seconds / 60) % 60);
    let mins= (minute < 10)? '0' + minute : minute;
    let second = seconds % 60;
    let secondS = (second < 10)? '0' + second : second;
    return  mins + ':' + secondS;
  }


  ngOnDestroy() {
  
    this.fetchNominaciones.emit(true)
    
    this.lugaresService.cancelarLugar(this.boletosSeleccionados)
    //// validar si se hizo el pago
    
  }
  llenarTabla() {

    this.boletos = this.boletosSeleccionados
    this.total = this.boletos.length * 575
    this.lugaresAdquiridos=this.boletos.map(x=>x.idLugar).join(",");
    this.codigotiket='REED22'+this.lugaresAdquiridos.replace(",","");
    ///console.log(this.boletos);
    // console.log(this.total);
     this.data = [
      'INFORMACION DE TU COMPRA',
      'Nombre: Jose Daniel',
      'Lugares Comprados:' + this.boletos.map(x=>x.idLugar).join(","),
      'Total de la compra:$'+this.total +'US',
      'Correo del comprados: john@doe.com',
    
    ]   
     this.dataToString = JSON.stringify(this.data);
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
