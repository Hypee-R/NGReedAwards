import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { reservacionService } from 'src/app/services/reservaciones.service';
import { UsuarioService } from 'src/app/services/usuarios.service';
import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/services/excel.service';
import { ConfirmationService } from 'primeng/api';
import { ReservacionModel } from 'src/app/models/reservacion.model';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ReservasService } from 'src/app/services/reservas.service';
import { ReservaModel } from 'src/app/models/reservar.model';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css'],
})
export class ReservasComponent implements OnInit {
  @ViewChild('reservacionPDF') reservacionElement!: ElementRef;

  @ViewChild('qrCodeElement', { static: false }) qrCodeElement: QRCodeComponent;
  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;

  piezasPorreservacion: any = [{ id: '', nombre: '', pago: 0, total: 0 }];

  /*reservacionCollectiondata: any = [
    {
      LugaresComprados: '',
      codigotiket: '',
      descripcionpago: '',
      fechaActualizacion: '',
      fechaCreacion: '',
      id: '',
      idpagopaypal: '',
      montopago: '',
      statuspago: '',
    },
  ];*/

  reservaCollectiondata: ReservaModel[] = [];
  reservacionForm: FormGroup;
  submitted: boolean;
  loading: boolean = true;
  showTemplatePDF: boolean = false;
  dataToString: string = '';
  csvRecords: ReservaModel[] = [];
  visible: boolean;
  reservacionModelDialog: boolean;
  reservacionModel: any;
  idModel: any = [{ id: '', nombre: '' }];

  excel: any;
  files;
  visibleDe: boolean = false;
  id: any;

  subscriptionStatusTemplatePDF: Subscription;
  @ViewChild('fileImportInput') fileImportInput: any;
  constructor(
    private firebaseServiceUsuarios: UsuarioService,
    private reservasService: ReservasService,
    //private firebaseServiceReservacion: reservacionService,

    private fb: FormBuilder,
    private toastr: ToastrService,
    private exporExcel: ExcelService,
    private variablesGL: VariablesService,
    private confirmationService: ConfirmationService
  ) {
    this.subscriptionStatusTemplatePDF =
      variablesGL.statusTemplateRservacionPDF.subscribe((status) => {
        this.showTemplatePDF = status;
      });
  }

  ngOnInit(): void {
    this.initForm();
    this.get();
    /*this.reservasService.obsr_UpdatedSnapshot.subscribe((snapshot) => {
      this.updatereservacionCollection(snapshot);
    });*/
  }

  ngOnDestroy(): void {
    if (this.subscriptionStatusTemplatePDF) {
      this.subscriptionStatusTemplatePDF.unsubscribe();
    }
  }

  initForm() {
    this.reservacionForm = this.fb.group({
      id: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      // fechaFin: ['', [Validators.required]],
    });
  }

  async add() {
    /*this.submitted = true;
    // this.visible = false
    if (this.reservacionForm.valid) {
      const { id, nombre } = this.reservacionModel;
      await this.firebaseServiceReservacion.addreservacion(
        this.reservacionModel
      );
      console.log('dd');
      this.reservacionForm.reset();

      this.visible = false;
    } else {
      this.toastr.info('Todos los Campos son requeridos!!', 'Espera');
      this.visible = true;
    }

    this.submitted = false;*/
  }

  async get() {
    // console.log('get2');
    this.reservasService.getReservacionesAdmin().then((data) => {
      console.log(data);
      this.reservaCollectiondata = data;
      /*this.reservacionCollectiondata = data;

      if (data[0]) {
        let dataString = [
          'INFORMACION DE TU COMPRA',
          'Lugares Comprados:' + data[0].LugaresComprados,
          'Total de la compra:$' + data[0].montopago + ' US',
          'Ticket de compra: ' + data[0].codigotiket,
          'Estatus de Pago: ' + data[0].descripcionpago,
          'Fecha de compra: ' + data[0].fechaCreacion,
        ];
        this.dataToString = JSON.stringify(dataString);
        console.log('datatostring ', this.dataToString);
      }*/
      this.reservaCollectiondata = this.reservaCollectiondata.sort((a, b) => {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
      });
      this.loading = false;
    });

   
  }

  updatereservacionCollection(snapshot: QuerySnapshot<DocumentData>) {
    /*this.reservaCollectiondata = [];
    snapshot.docs.forEach((student) => {
      this.reservaCollectiondata.push({
        ...student.data(),
        id: student.id,
      });
    });*/
  }

  async delete(docId: any) {
    this.confirmationService.confirm({
      message:
        '¿Está seguro de que desea eliminar la Reservacion  ' + docId.id + '?',
      header: 'Confirmacion',
      icon: 'pi pi-exclamation-triangle',

      accept: async () => {
        //console.log(docId)
        await this.reservasService.deletereservacion(docId).then((result) => {
          this.get();
          this.toastr.success('Borrado correctamente');
        });
        //this.firebaseServiceReservacion.deletereservacion(docId.id);
      },
    });
  }
  edit: boolean = false;
  editar(reservacion: any) {
    this.reservacionModel = { ...reservacion };
    this.edit = true;
  }
  update() {
    /*this.firebaseServiceReservacion.updatereservacion(this.reservacionModel);
    this.edit = false;*/
  }

  openNew() {
    if (this.files == undefined) {
      this.toastr.error('Selecciona un archivo valido', 'Documento');
      return;
    }
    if (this.isCSVFile(this.files[0])) {
      //let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(this.files[0]);

      reader.onload = async () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
        let headersRow = this.getHeaderArray(csvRecordsArray);
        this.csvRecords = this.getDataRecordsArrayFromCSVFile(
          csvRecordsArray,
          headersRow.length
        );
        await this.savedatafile(this.csvRecords);
      };

      reader.onerror = function () {
        alert('Unable to read ');
      };
    } else {
      //this.toastr.warning('Por favor importe un archivo .csv Valido!');
      this.toastr.error('Por favor importe un archivo .csv Valido!');
      this.fileReset();
    }
  }

  hideDialog() {
    this.visibleDe = false;
    this.visible = false;
    this.edit = false;
    this.submitted = false;
  }

  import(key: any) {
    console.log(key);
  }

  Excel() {
    var reportExcel = [];
    /*this.firebaseServiceUsuarios.getusuarios().subscribe((usuarios) => {
      this.reservaCollectiondata.forEach((reservacion) => {
        //console.log(reservacion);
        usuarios.forEach((usuario) => {
          if (usuario.uid === reservacion.uid) {
            reportExcel.push({
              '#': reservacion.id,
              LUGARES_COMPRADOS: reservacion.LugaresComprados,
              CODIGO_TICKET: reservacion.codigotiket,
              DESCRIPCION_CODIGO: reservacion.descripcionpago,
              FECHA_CREACION: reservacion.fechaCreacion,
              FECHA_ACTUALIZACION: reservacion.fechaActualizacion,
              MONTO_PAGO: reservacion.montopago,
              ESTATUS_PAGO: reservacion.statuspago,
              ID_PAGO_PAYPAL: reservacion.idpagopaypal,
              NOMBRE_USUARIO: usuario.firstName,
              APELLIDO_USUARIO: usuario.lastName,
              EMAIL_USUARIO: usuario.email,
              TELEFONO: usuario.phone,
            });
            console.log(usuario);
          }
        });
      });

      this.exporExcel.reservaciones(reportExcel);
    });*/
    /*this.reservaCollectiondata.forEach((reserva) =>{
          reportExcel.push({
            '#': reservacion.id,
            LUGARES_COMPRADOS: reservacion.LugaresComprados,
            CODIGO_TICKET: reservacion.codigotiket,
            DESCRIPCION_CODIGO: reservacion.descripcionpago,
            FECHA_CREACION: reservacion.fechaCreacion,
            FECHA_ACTUALIZACION: reservacion.fechaActualizacion,
            MONTO_PAGO: reservacion.montopago,
            ESTATUS_PAGO: reservacion.statuspago,
            ID_PAGO_PAYPAL: reservacion.idpagopaypal,
            NOMBRE_USUARIO: usuario.firstName,
            APELLIDO_USUARIO: usuario.lastName,
            EMAIL_USUARIO: usuario.email,
            TELEFONO: usuario.phone,
          });
    })*/
    var exportoReservas = []
    this.reservaCollectiondata.forEach(reserva =>{
      exportoReservas.push(this.recortarReserva(reserva));
    })
    this.exporExcel.reservas(exportoReservas);
  }

  recortarReserva(row) {
    return {

      '': row.id,
      'Mesa y Asiento': row.mesa,
      'Nombre':row.nombre,
      'Comida': row.comida,
      'Empresa': row.empresa,
      'STATUS PAGO': row.statusPago,
      'PAGO MX O DLS': row.pago,
      'Correo': row.correo,
      'Boleto enviado': row.enviado,
      'Confirmado': row.confirmado
    };
  }

  downloadPdfReservacion(reservacion: any) {
    // Configura los datos para el QR
    this.dataToString = 'Boleto:' + reservacion.mesa + '-FOLIO:' + reservacion.uid;

    // Generar y descargar el QR en PNG
    setTimeout(() => {
      this.downloadQR();
    }, 500); // Delay para asegurarse que el QR se renderice antes de capturarlo
  }

  downloadQR() {
    const canvasElement = this.qrCodeElement.qrcElement.nativeElement.querySelector('canvas');
    const imgData = canvasElement.toDataURL('image/png'); // Obtener la imagen en base64

    // Crear un enlace temporal para descargar el PNG
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'reservacion_qr.png';
    link.click();
  }

  fileChangeListener($event: any): void {
    this.files = $event.srcElement.files;
  }

  isCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let dataArr = [];
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let data = (<string>csvRecordsArray[i]).split(',');
      if (data.length == headerLength) {
       // console.log(data)
        let csvRecord: ReservaModel = {
          id: data[0].trim() || '',
          mesa: data[1].trim() || '',
          nombre: data[2].trim() || '',
          comida: data[3].trim() || '',
          empresa: data[4].trim() || '',
          statusPago: data[5].trim() || '',
          pago: data[6].trim() || '',
          correo: data[7].trim() || '',
          enviado: data[8].trim() || '',
          confirmado: data[9].trim() || '',
        };
        //console.log(csvRecord)
        dataArr.push(csvRecord);
      }
    }
    return dataArr;
  }

  async savedatafile(reservas: ReservaModel[]) {
    const encontrados: ReservaModel[] = [];
    const noEncontrados: ReservaModel[] = [];
    reservas.forEach((reserva) => {
      const index = this.reservaCollectiondata.findIndex(
        (item) => item.id === reserva.id
      );

      if (index !== -1) {
        reserva.uid = this.reservaCollectiondata[index].uid;
        if (
          this.areObjectsDifferent(this.reservaCollectiondata[index], reserva)
        ) {
          //console.log("Son diferentes")
          encontrados.push(reserva);
        } else {
          console.log('Son iguales');
        }
        /*reserva.uid = this.reservaCollectiondata[index].uid
        this.reservaCollectiondata[index] = reserva;
        //this.reservaCollectiondata[index].nombre = invitacion.nombre;
        encontrados.push(this.reservaCollectiondata[index]);*/
      } else {
        noEncontrados.push(reserva);
      }
    });
    if (encontrados.length == 0 && noEncontrados.length == 0) {
      this.fileReset();
      this.toastr.success(
        'No hay cambios para actualizar,intenta cargar un excel diferente'
      );
      return;
    }
    const promisesEdit = encontrados.map((reserva) =>
      this.reservasService.updateReserva(reserva)
    );
    Promise.all(promisesEdit)
      .then((results) => {})
      .catch((error) => {
        console.error('Error al actualizar invitaciones:', error);
      });

    const promises = noEncontrados.map((reserva) =>
      this.reservasService.addreservacion(reserva)
    );
    Promise.all(promises)
      .then((results) => {
        this.toastr.success('Reservas de acceso agregadas correctamente');
        this.get();
        //this.onClose.emit();
      })
      .catch((error) => {
        console.error('Error al añadir invitaciones:', error);
      });
    this.fileReset();
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = '';
    this.csvRecords = [];
  }

  areObjectsDifferent(obj1: any, obj2: any): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return true;
    }

    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return true;
      }
    }

    return false;
  }
}
