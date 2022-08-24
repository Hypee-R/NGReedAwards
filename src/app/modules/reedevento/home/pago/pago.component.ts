
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { SafeUrl } from "@angular/platform-browser"
import { PrintingService } from 'src/app/services/Print.service';
import {DialogModule} from 'primeng/dialog';
import { LugaresService } from 'src/app/services/lugares.service';
import { timer } from 'rxjs';
import { reservacionService } from 'src/app/services/reservaciones.service';
import { ReservacionModel } from '../../../../models/reservacion.model';
import { collection, doc, Firestore, getDoc, getFirestore, setDoc } from "@angular/fire/firestore";
import { collectionData } from '@angular/fire/firestore';
import { FileItem } from '../../../../models/img.model';
import { CargaImagenesService } from 'src/app/services/cargaImagenes.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
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

  @Input() boletosSeleccionados:boleto[];
  @Output() fetchNominaciones: EventEmitter<boolean> = new EventEmitter<boolean>()

  cols: any[];
  nombres:any[];
  boletos: boleto[]=[];
  archivos: FileItem[] = [];
  boleto:boleto={idLugar:"A1",precio:"547 USD",comprado:false,apartado:false,hora:""}
  public grabber = false;

  userData: any;
  uid = JSON.parse(localStorage.d).uid;
  constructor(    private printingService: PrintingService,
                  private lugaresService:LugaresService,
                  private reservacionService: reservacionService,
                  private afs: Firestore,
                  private cargaImagenesFBService: CargaImagenesService,
                  private variablesGL: VariablesService,
    ) {
      this.getUserData();

    }
  total = 0
  totalPorcentaje=0
  totalParcial=0
  //QR
  public qrCodeDownloadLink: SafeUrl = "";
  dataToString:any;
  data: any;
 //Status Pago
  statuspago : boolean = false;
  lugaresAdquiridos = '' ;
  codigotiket  = '' ;
  tiempo=true;
  timeLeft: number = 120;
  time:string=''
  interval;
  //Datos del comprador
  nombrecomprador  = '' ;
  correocomprador  = '' ;
//Tipo de pago
opcionSeleccionado:any;
  pagarCon : any;
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
        // console.log(data)
        const order = await actions.order.capture();
        // console.log(order.id);
        // console.log(order.status);
        // console.log(order.purchase_units);
        if(order.status=='COMPLETED'){
          this.statuspago=true;
          this.lugaresService.updatelugarPagado(this.boletosSeleccionados)
          this.tiempo=false;
          clearInterval(this.interval);

        }
        const dataReservacion: ReservacionModel = {
          id: Date.now().toString(),
          LugaresComprados: this.lugaresAdquiridos,
          codigotiket:this.codigotiket,
          peticionpaypal:data,
          respuestapaypal:order,
          idpagopaypal:order.id,
          statuspago: this.statuspago ==true ? 'pagado':'No pagado',
          descripcionpago: this.statuspago ==true ? 'pagado':'No pagado',
          montopago: this.total,
          uid: JSON.parse(localStorage.d).uid,
          fechaCreacion: "",
          fechaActualizacion: "",
          Nombrecomprador:this.nombrecomprador,
          fileBaucher: null,
          pagarCon: "paypal"
        };
        this.reservacionService.addreservacion(dataReservacion);


      },
      onError: err =>{
        console.log(err);

      }
    })
    .render( this.paypalElement.nativeElement );

    this.variablesGL.endProcessCargaCompleta.subscribe(endProcessUpload => {
      //Aqui ya terminó de subir los archivos al storage y agregar las url a firestore
      if(endProcessUpload){
        if(this.archivos.length > 0){
          let imgSave = this.cargaImagenesFBService.idsImageSave;
          this.statuspago=true;
          this.lugaresService.updatelugarPagado(this.boletosSeleccionados)
          this.tiempo=false;
          clearInterval(this.interval);
          const dataReservacion: ReservacionModel = {
            id: Date.now().toString(),
            LugaresComprados: this.lugaresAdquiridos,
            codigotiket:this.codigotiket,
            peticionpaypal:null,
            respuestapaypal:null,
            idpagopaypal:null,
            statuspago: this.statuspago == true ? 'pagado':'No pagado',
            descripcionpago: this.statuspago ==true ? 'pagado':'No pagado',
            montopago: this.total,
            uid: JSON.parse(localStorage.d).uid,
            fechaCreacion: "",
            fechaActualizacion: "",
            Nombrecomprador:this.nombrecomprador,
            pagarCon: "swift",
            fileBaucher: imgSave.find(x => x.fileMapped == 'FileBaucher') ? { idFile: imgSave.find(x => x.fileMapped == 'FileBaucher').idDoc, url: imgSave.find(x => x.fileMapped == 'FileBaucher').url } : '',
          };
          this.reservacionService.addreservacion(dataReservacion);
        }
      }else{
        console.error("Error al guardar el baucher *******");

      }
    });

    //console.log(this.boletosSeleccionados)
    this.llenarTabla();
    this.cols = [
      { field: 'idLugar', header: 'Lugar' },
      { field: 'precio', header: 'Precio' },
    ];
    this.nombres = [
      { field: 'idLugar', header: '' },
      { field: 'precio', header: '' },
    ];

    this.tiempo=true

    this.showTime()

    this.getUserData().subscribe(data => {
      if(data) {
        this.userData = data.filter(item => item.uid === this.uid);
       this.nombrecomprador  = this.userData[0].firstName+ " "+this.userData[0].lastName
       this.correocomprador= this.userData[0].email;
      }
    },
    err => {
    }
    );

  }

  getUserData() {
    const itemsCollection = collection(this.afs,'usuarios');
    return collectionData(itemsCollection);
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
    clearInterval(this.interval);
    //console.log(this.statuspago)
    this.getLugares(this.boletosSeleccionados)
    this.fetchNominaciones.emit(true)
    //// validar si se hizo el pago

  }
  llenarTabla() {

    this.boletos = this.boletosSeleccionados

    this.totalParcial = this.boletos.length * 575
    this.totalPorcentaje=(this.totalParcial)*.05
    this.total=this.totalParcial+this.totalPorcentaje
    this.lugaresAdquiridos=this.boletos.map(x=>x.idLugar).join(",");
    this.codigotiket='REED22'+this.lugaresAdquiridos.replace(",","");

     this.data = [
      'INFORMACION DE TU COMPRA',
      'Nombre: '+  this.nombrecomprador,
      'Lugares Comprados:' + this.lugaresAdquiridos,
      'Total de la compra:$'+this.total +'US',
      'Correo del comprados: '+ this.correocomprador,
      'Correo del comprados: '+this.codigotiket,

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
  capturar() {
    // Pasamos el valor seleccionado a la variable verSeleccion
    this.pagarCon = this.opcionSeleccionado;
    console.log('Tipo de pago=>'+   this.pagarCon);
}

  lugaresPagados:boleto[]=[]
  async getLugares(boleto:boleto[]){
    await this.lugaresService.getLugaresPagados(boleto[0]).subscribe( (data) => {



     for (let dato of data){
       let lug:boleto={idLugar:dato['idLugar'],precio:dato['precio'],comprado:dato['comprado'],apartado:dato['apartado'],hora:dato['fecha']}
       this.lugaresPagados.push(lug)
     }

     for(let l of this.lugaresPagados){
        if(!l.comprado){
          this.lugaresService.cancelarLugar(this.boletosSeleccionados)
        }
     }

   }, err => {

   });

 }


 onFileSelected(event: any, fileMapped: string){
  if(event.target.files.length>0){
    event.target.files;
    let archivosLista: FileList = event.target.files;
    for (const propiedad in Object.getOwnPropertyNames(archivosLista)) {
     const archivoTemp = archivosLista[propiedad];

     const newArchivo = new FileItem(archivoTemp);
     newArchivo.fileMapped = fileMapped;
     this.archivos.push(newArchivo);
    }

    this.cargaImagenesFBService.upload(this.archivos);

  }
}

}
