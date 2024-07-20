import Swal from 'sweetalert2';
import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NominacionModel } from 'src/app/models/nominacion.model';
import { reservacionService } from 'src/app/services/reservaciones.service';
import { ReservacionModel } from 'src/app/models/reservacion.model';
import { SafeUrl } from "@angular/platform-browser"
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { VariablesService } from '../../../services/variablesGL.service';
import { Subscription } from 'rxjs';


declare var paypal;

@Component({
  selector: 'app-mis-lugares',
  templateUrl: './mis-lugares.component.html',
  styleUrls: ['./mis-lugares.component.css']
})
export class MisLugaresComponent implements OnInit, OnDestroy {
  @ViewChild('reservacionPDF') reservacionElement: ElementRef;

  visibleSide: boolean;
  listBoletos: ReservacionModel[] = [];
  loading: boolean = true;
  accion: string = '';
  nominacionEditar: any;
  showTemplatePDF : boolean = false;
    //QR
    public qrCodeDownloadLink: SafeUrl = "";
    dataToString:any;
    data: any;

    subscriptionStatusTemplatePDF: Subscription;

  constructor(
    private toastr: ToastrService,
    private variablesGL: VariablesService,
    private reservacionesService: reservacionService,
  ) {
    this.getBoletos();

    this.subscriptionStatusTemplatePDF = variablesGL.statusTemplateRservacionPDF.subscribe( status => {
      this.showTemplatePDF = status;
    });
  }

  ngOnDestroy(): void {
    if(this.subscriptionStatusTemplatePDF){
      this.subscriptionStatusTemplatePDF.unsubscribe();
    }
  }

  ngOnInit(): void {

  }

  async getBoletos(){
    this.listBoletos = await this.reservacionesService.getreservaciones();
    console.log( this.listBoletos)

    this.data = [
      'INFORMACION DE TU COMPRA',
      'Lugares Comprados:' + this.listBoletos[0].LugaresComprados,
      'Total de la compra:$'+this.listBoletos[0].montopago + ' US',
      'Ticket de compra: '+ this.listBoletos[0].codigotiket,
      'Estatus de Pago: '+this.listBoletos[0].descripcionpago,
      'Fecha de compra: '+this.listBoletos[0].fechaCreacion,

    ]
     this.dataToString = JSON.stringify(this.data);


    if(this.listBoletos.length > 0){

    }
    if(this.listBoletos.length == 0){
      this.listBoletos = null;
    }
    this.loading = false;

  }

  nuevaNominacion(){
    this.accion = 'agregar';
    this.nominacionEditar = null;
    this.visibleSide = true;
  }

  editarNominacion(nominacion: NominacionModel){
    this.accion = 'editar';
    this.nominacionEditar = nominacion;
    this.visibleSide = true;
  }



  vistaPrevia(nominacion){
     if(nominacion.mostrarMas){
        nominacion.mostrarMas = false;
     }else{
        nominacion.mostrarMas = true;
     }
  }




  //ticket
    // Re-enable, when a method to download images has been implemented
    onChangeURL(url: SafeUrl) {
      this.qrCodeDownloadLink = url;

    }

    downloadPdfReservacion(lugar: ReservacionModel): void {
      this.variablesGL.statusTemplateRservacionPDF.next(true);
      setTimeout(() => {
        let tmpl = {...this.reservacionElement};
        console.log('template ', tmpl);
        this.variablesGL.generateReservacionPDF(lugar, this.reservacionElement);
      }, 100);
    }
}
