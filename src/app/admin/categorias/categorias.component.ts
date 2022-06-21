import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CategoriasService } from 'src/app/services/categorias.service';
import { NominacionService } from 'src/app/services/nominacion.service';
import { UsuarioService } from 'src/app/services/usuarios.service';
import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/services/excel.service';
import { ConfirmationService } from 'primeng/api';

// import { Subject } from 'rxjs/Subject';
@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  piezasPorCategoria: any = [
    {id:'', nombre:'',pago: 0, total: 0}
  ];

  categoriaCollectiondata: any = [
    {id:'', nombre:''}
  ];
  categoriaForm: FormGroup;
  submitted: boolean;
  loading: boolean =true

  visible: boolean;
  categoriaModelDialog: boolean;
  categoriaModel: any;
  idModel: any = [
    {id:'', nombre:''}
  ];;

  excel:any;



  visibleDe:boolean= false;
  id: any;




  constructor(

    private firebaseService: CategoriasService,
    private firebaseServiceNominacion: NominacionService,
    private firebaseServiceUsuarios: UsuarioService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private exporExcel: ExcelService,
    private confirmationService: ConfirmationService
  ) {

  }


  ngOnInit(): void {
    this.initForm();
    this.get();

    this.firebaseService.obsr_UpdatedSnapshot.subscribe((snapshot) => {
      this.updatecategoriaCollection(snapshot);
    })
  }

  initForm() {
    this.categoriaForm = this.fb.group({
      id: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      // fechaFin: ['', [Validators.required]],

    })
  }

  async add() {
    this.submitted = true;
    // this.visible = false
    if (this.categoriaForm.valid) {

          const { id,nombre} = this.categoriaModel;
          await this.firebaseService.addcategoria(id ,nombre);
          console.log('dd');
          this.categoriaForm.reset()
          // this.categoria.titulo = "";
          // this.categoria.fechaInicio = "";
          // this.categoria.fechaFin = "";
this.visible = false


    } else {

      this.toastr.info('Todos los Campos son requeridos!!', 'Espera');
      this.visible = true
      // this.categoriaCollectiondata.reset()
    }
    // this.convocatoriaModelDialog = false;
    // this.convocatoriaModel;
this.submitted = false
  }


  async get() {
    this.firebaseService.getCategorias().subscribe((data) => {
      this.categoriaCollectiondata = data;

      this.loading= false
    });
    //this.updatecategoriaCollection(snapshot);
  }


  updatecategoriaCollection(snapshot: QuerySnapshot<DocumentData>) {
    this.categoriaCollectiondata = [];
    snapshot.docs.forEach((student) => {
      this.categoriaCollectiondata.push({ ...student.data(), id: student.id });
    })
  }

  async delete(docId: any) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar la ctegoria  '+ docId.nombre + '?',
      header: 'Confirmacion',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {

          this.firebaseService.deletecategoria(docId.id);
      }
  });
  }
edit: boolean = false
  editar(categoria: any) {
    this.categoriaModel = { ...categoria }
    this.edit = true


    // console.log(this.categoriaModel);
    // console.log(this.id.id);


  }
  update() {
this.firebaseService.updatecategoria(this.categoriaModel.id, this.categoriaModel.nombre);
this.edit= false
  }



  Excel() {


      this.exporExcel.categoria(this.categoriaCollectiondata);


  }

  async getUsersForReport() {
    var usuarios2 = [];
     await this.firebaseServiceUsuarios.getusuarios().subscribe((data) => {
      usuarios2 = data;
      //console.log(data);

    return usuarios2;
    });
    return usuarios2;
  }

  async GenereteReportMasterExcel(){
    var nominaciones = [];
    var usuarios = [];


    await this.firebaseServiceNominacion.getAllNominaciones().then((data) => {
      nominaciones = data;
      this.firebaseServiceUsuarios.getusuarios().subscribe((data) => {
        usuarios = data;

        var piezasPorCategoria = this.ExcelPiezasPorCategoria(nominaciones);
        var piezasInscritas = this.ExcelPiezasInscritas(usuarios,nominaciones);
        var usuariosConPiezasInscritas = this.ExcelUsuariosConPiezasInscritas(usuarios,nominaciones);
        var usuariosSinPiezasInscritas = this.ExcelUsuariosSinPiezasInscritas(usuarios,nominaciones);
        var ordenesPagadas = this.ExcelOrdenesPagadas(usuarios,nominaciones);
        var ordenesNoPagadas = this.ExcelOrdenesNoPagadas(usuarios,nominaciones);
        this.exporExcel.piezasPorCategoria(piezasPorCategoria, piezasInscritas, usuariosConPiezasInscritas,usuariosSinPiezasInscritas,ordenesPagadas,ordenesNoPagadas);
        });

    });


  }

  ExcelPiezasPorCategoria(nominaciones) {
    //var nominaciones = [];

    //this.getUsersForReport();

    //await this.firebaseServiceNominacion.getAllNominaciones().then((data) => {

      //nominaciones = data;


      /*Reporte piezas por categoria*/
      this.categoriaCollectiondata.forEach((category) => {
        var countCategories = 0;
        var countPagadas = 0
        nominaciones.forEach((nominacion) => {
          if (nominacion.categoria == category.nombre) {
            console.log("-----------" );
            countCategories++;

            if (nominacion.pagado == "Pago Realizado" || nominacion.pagado == "pagado") {
              countPagadas++;
            }
          }
        })

        if(countCategories == countPagadas){
          this.piezasPorCategoria.push(Object.assign(category, {total:countCategories, pago:"Pagada"}));
        }

        if(countCategories != countPagadas && countCategories > 0){
          this.piezasPorCategoria.push(Object.assign(category, {total:countCategories, pago:"Pago pendiente"}));
        }

        if(countCategories == 0){
          this.piezasPorCategoria.push(Object.assign(category, {total:countCategories, pago:"Pago pendiente"}));
        }
      });

      return this.piezasPorCategoria;
    //});
   return this.piezasPorCategoria;
  }

  ExcelPiezasInscritas(usuarios, nominaciones) {
    var piezasInscritas = [];
    nominaciones.forEach((nominacion, index) => {
      usuarios.forEach((usuario) => {
        if (nominacion.uid == usuario.uid) {
          console.log(nominacion);

          piezasInscritas.push(new Object({"#":index, "ID_USUARIO": usuario.uid, "NOMBRE": usuario.firstName, "APELLIDO": usuario.lastName,"CORREO": usuario.email, "TELEFONO": usuario.phone,"PAGO": nominacion.statuspago, "ID_PIEZA": nominacion.id, "NOMBRE_DE_LA_PIEZA": nominacion.titulo, "EMPRESA": nominacion.organizacion, "FECHA_DE_NOMINACIÓN": nominacion.fechaCreacion, "NUM_VIDEO": 0,"NUM_IMAGENES": 0, "NUM_AUDIO": 0, "NUM_DOCS": 0, "NOMBRE_CATEGORIA": 0}));
        }
      });
    })
    return piezasInscritas;
  }

  ExcelUsuariosConPiezasInscritas(usuarios, nominaciones) {
    var piezasInscritas = [];

      usuarios.forEach((usuario,index) => {
      var num_nominaciones = 0;
        nominaciones.forEach((nominacion) => {
        if (nominacion.uid == usuario.uid) {
          console.log(nominacion);

         if (num_nominaciones == 0) {
          piezasInscritas.push(new Object({"#":index, "ID_USUARIO": usuario.uid, "NOMBRE": usuario.firstName, "APELLIDO": usuario.lastName,"CORREO": usuario.email, "TELEFONO": usuario.phone,"FECHA_DE_NOMINACIÓN": nominacion.fechaCreacion}));
         }
          num_nominaciones++;
        }
      });
    })
    return piezasInscritas;
  }

  ExcelUsuariosSinPiezasInscritas(usuarios, nominaciones) {
    var piezasInscritas = [];

      usuarios.forEach((usuario,index) => {
      var num_nominaciones = 0;
        nominaciones.forEach((nominacion) => {
        if (nominacion.uid == usuario.uid) {
          num_nominaciones++;
        }
      });
      if(num_nominaciones == 0){
        piezasInscritas.push(new Object({"#":index, "ID_USUARIO": usuario.uid, "NOMBRE": usuario.firstName, "APELLIDO": usuario.lastName,"CORREO": usuario.email, "TELEFONO": usuario.phone,"FECHA_DE_NOMINACIÓN": ""}));
      }
    })
    return piezasInscritas;
  }

  ExcelOrdenesPagadas(usuarios, nominaciones) {
    var piezasInscritas = [];

      usuarios.forEach((usuario,index) => {
      var num_nominaciones = 0;
      var total_pagado = 0;
      var lastMethodPay = "";
        nominaciones.forEach((nominacion) => {
        if (nominacion.uid == usuario.uid && (nominacion.statuspago == "Pago Realizado" || nominacion.statuspago == "pagado")) {
          num_nominaciones++;
          total_pagado += parseInt(nominacion.montopago);
          lastMethodPay = nominacion.pagarCon;
        }
      });
      if(num_nominaciones > 0){
        piezasInscritas.push(new Object({"#":index, "ID_USUARIO": usuario.uid, "NOMBRE": usuario.firstName, "APELLIDO": usuario.lastName,"CORREO": usuario.email, "TELEFONO": usuario.phone,"ESTADO":"","NUM_PIEZAS":num_nominaciones, "TOTAL_USD":"","COIN":"","TOTAL_MXM":"$" +total_pagado,"COIN_2":"MXM", "FECHA_DE_PAGO": "","DATA":"","MEDIO_DE_PAGO":lastMethodPay}));
      }
    })
    return piezasInscritas;
  }

  ExcelOrdenesNoPagadas(usuarios, nominaciones) {
    var piezasInscritas = [];

      usuarios.forEach((usuario,index) => {
      var num_nominaciones = 0;
      var total_pagado = 0;
      var lastState = "";
        nominaciones.forEach((nominacion) => {
        if (nominacion.uid == usuario.uid && (nominacion.statuspago != "Pago Realizado" || nominacion.statuspago != "pagado")) {
          num_nominaciones++;
          total_pagado += parseInt(nominacion.montopago);
          lastState = nominacion.statuspago;
        }
      });
      if(num_nominaciones > 0){
        piezasInscritas.push(new Object({"#":index, "ID_USUARIO": usuario.uid, "NOMBRE": usuario.firstName, "APELLIDO": usuario.lastName,"CORREO": usuario.email, "TELEFONO": usuario.phone,"ESTADO":"","NUM_PIEZAS":num_nominaciones, "TOTAL":"$" +total_pagado}));
      }
    })
    return piezasInscritas;
  }

  openNew() {
    this.categoriaModel = { id: '', nombre: ''}
    this.visible = true;
    this.submitted = false;
    this.categoriaForm.reset()

  }
  hideDialog() {
    this.visibleDe = false;
    this.visible = false;
    this.edit = false
    this.submitted = false;
  }






  import(key:any){
    //  this.firebaseService.addcategoria(this.keys);
    console.log(key);

  }
}
