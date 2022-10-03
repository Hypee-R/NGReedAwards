import Swal from 'sweetalert2';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NominacionModel } from 'src/app/models/nominacion.model';
import { reservacionService } from 'src/app/services/reservaciones.service';
import { ReservacionModel } from 'src/app/models/reservacion.model';
import { SafeUrl } from "@angular/platform-browser"
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { VariablesService } from '../../../services/variablesGL.service';


declare var paypal;

@Component({
  selector: 'app-mis-lugares',
  templateUrl: './mis-lugares.component.html',
  styleUrls: ['./mis-lugares.component.css']
})
export class MisLugaresComponent implements OnInit {
  @ViewChild('reservacionPDF') reservacionElement!: ElementRef;

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

  constructor(
    private toastr: ToastrService,
    private variablesGL: VariablesService,
    private reservacionesService: reservacionService,
  ) {
    this.getBoletos();
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
      //this.listBoletos = this.listlugares.filter(x => x.titulo && x.nominado && x.descripcion);
      //console.log('data ', this.listlugares);
      /*for(let l of this.listBoletos){
        console.log(l.id)
      }*/
      //console.log(this.listBoletos)
    }
    if(this.listBoletos.length == 0){
      this.listBoletos = null;
    }
    //this.misBoletos
    this.loading = false;
    // .subscribe( data => {
    //     if(data){
    //       this.listlugares = data;
    //       this.listlugares.forEach( (element: QueryDocumentSnapshot) => {
    //         console.log('data lugares ', element.data());
    //       });
    //       if(this.listlugares.length == 0){
    //         this.listlugares = null;
    //       }
    //       this.loading = false;
    //     }
    // },
    // err => {
    //   this.toastr.error('Hubo un problema al obtener las lugares, intentelo más tarde...','Error')
    //   this.loading = false;
    // }
    // );
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

  /*async eliminarNominacion(nominacion: NominacionModel){
    Swal.fire({
      title: 'Desea Eliminar Ésta Nominación?',
      text: "Ésta accion no se podrá revertir ni cambiar",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3c3174',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.lugaresService.deleteNominacion(nominacion);
        this.toastr.success('Nominación eliminada!!', 'Success');
        this.getlugares();
      }
    });
  }*/

  vistaPrevia(nominacion){
     if(nominacion.mostrarMas){
        nominacion.mostrarMas = false;
     }else{
        nominacion.mostrarMas = true;
     }
  }

  async fetchNominacion(){
    /*await this.getlugares();
    this.visibleSide = false;
    this.accion = null;
    this.nominacionEditar = null;
    */
  }


  //ticket
    // Re-enable, when a method to download images has been implemented
    onChangeURL(url: SafeUrl) {
      this.qrCodeDownloadLink = url;
    }

    public generatePDF(lugar: ReservacionModel): void {
      this.showTemplatePDF = true;
      let widthDocument = this.variablesGL.getWidthDocument();

      Swal.fire({
          title: 'Por favor espera...',
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
      });

      setTimeout(() => {
        html2canvas(this.reservacionElement.nativeElement, { scale: 3 }).then((canvas) => {
        const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
        const fileWidth = widthDocument;
        const generatedImageHeight = (canvas.height * fileWidth) / canvas.width;
        let PDF = new jsPDF('p', 'mm', 'a4',);
        PDF.addImage(imageGeneratedFromTemplate, 'PNG', 0, 5, fileWidth, generatedImageHeight,);
        PDF.html(this.reservacionElement.nativeElement.innerHTML);
        PDF.text(lugar.codigotiket.toString(),7,68);//Folio
        PDF.text(lugar.Nombrecomprador.toString(),7,86);//Comprador
        PDF.text(lugar.montopago.toString(),110,86);//Costo
        PDF.text(lugar.codigotiket.toString(),7,269);//Folio
        PDF.text(lugar.Nombrecomprador.toString(),7,288);//Comprador
        PDF.text(lugar.montopago.toString(),110,288);//Costo
        PDF.link(55, 231, 44, 7, { url: 'https://bit.ly/3KsUcLv' });//url left
        PDF.link(160, 231, 44, 7, { url: 'https://bit.ly/3PKjSUy' });//url rigth
        // PDF.textWithLink('https://bit.ly/3KsUcLv', 55, 230,{ url: 'https://bit.ly/3KsUcLv' });
        // PDF.textWithLink('https://bit.ly/3PKjSUy', 160, 230,{ url: 'https://bit.ly/3PKjSUy' });
        PDF.save('reed-latino-reservacion.pdf');
        setTimeout(() => {
            Swal.close();
            this.showTemplatePDF = false;
            Swal.fire({
              icon: 'success',
              title: 'PDF Generado Correctamente!',
              showConfirmButton: false,
              timer: 2500
            });
          }, 1000);
        });
      }, 1000);

    }
}
