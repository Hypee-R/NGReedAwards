import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NominacionModel } from 'src/app/models/nominacion.model';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ExcelService } from 'src/app/services/excel.service';
import { NominacionService } from 'src/app/services/nominacion.service';
import { UsuarioService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-evaluacion-nominaciones',
  templateUrl: './evaluacion-nominaciones.component.html',
  styleUrls: ['./evaluacion-nominaciones.component.css']
})


export class EvaluacionNominacionesComponent implements OnInit {
  visibleSide: boolean;
  accion: string = '';
  nominacionEditar: NominacionModel;
  evaluar: evaluardata[];
  selectedNominacion: NominacionModel;
  loading: boolean = true;
  listNominaciones: any[] = [];
  usuarios: any[] = [];
  body: any;
  cols: any;
  value: number = 0;
  selectedEvaluacion: evaluardata;

  userData: any;
  uid = JSON.parse(localStorage.d).uid;
  constructor(
    private firebaseService: CategoriasService,
    private toastr: ToastrService,
    private nominacionesService: NominacionService,
    private nominacionService: NominacionService,
    private usuariosService: UsuarioService,
    private exportExcel: ExcelService
  ) {
    this.usuariosService.getusuarios().subscribe((data) => {
      this.usuarios = data;
      this.userData = data.filter(item => item.uid === this.uid);
      console.log('userData ', this.userData);
      this.getNominaciones();
     
    });


  

    this.body = document.body;
    this.cols = [
    
      { field: 'titulo', header: 'Titulo', filter: 'titulo' },
      { field: 'nominado', header: 'Nominado', filter: 'nominado' },
      { field: 'categoria', header: 'Categoría', filter: 'categoria' },
      // {
      //   field: 'fechaCreacion',
      //   header: 'Fecha Creación',
      //   filter: 'fechaCreacion',
      // },
      // {
      //   field: 'fechaActualizacion',
      //   header: 'Fecha Actualización',
      //   filter: 'fechaActualizacion',
      // },
      // { field: 'displayName', header: 'Usuario Nombre', filter: 'usuario.displayName'},
      // { field: 'email', header: 'Usuario Correo', filter: 'usuario.email' },
    ];
  }

  ngOnInit(): void {
    this.nominacionEditar = new NominacionModel();
    this.evaluar = [
      {name: '1', code: '1'},
      {name: '2', code: '2'},
      {name: '3', code: '3'},
      {name: '4', code: '4'},
      {name: '5', code: '5'}
  ];
  }

  
  
  async getNominaciones() {
    this.listNominaciones = await this.nominacionesService.getAllNominaciones();
    if (this.listNominaciones.length > 0) {
      this.listNominaciones = this.listNominaciones.filter(
        (x) => x.titulo && x.nominado && x.descripcion
      );
      this.listNominaciones.forEach((item) => {
        let usuario = this.usuarios.find((x) => x.uid == item.uid);
        item.usuario = usuario;
      });
    }
    if (this.listNominaciones.length == 0) {
      this.listNominaciones = null;
    }
    this.loading = false;
    console.log('data ', this.listNominaciones);
  }

  vistaPrevia(nominacion) {
    if (nominacion.mostrarMas) {
      nominacion.mostrarMas = false;
    } else {
      nominacion.mostrarMas = true;
    }
  }

guardarEvaluacion(dataNominacion: NominacionModel){

  if(this.selectedEvaluacion==undefined){ this.toastr.error('No se le agrego una Evaluacion a la Nominacion!!', 'Error');}else{
  dataNominacion.evaluacion=this.selectedEvaluacion.code;
  console.log(this.selectedEvaluacion);
  if(dataNominacion.titulo && dataNominacion.nominado && dataNominacion.descripcion){
     this.nominacionService.updateNominacion(dataNominacion);
    console.log(dataNominacion);
   
    this.toastr.success('Nominación actualizada con exito!!', 'Success');
    console.log("END PROCESS UPDATE");
   
  }else{
    console.log('********** datos vacios, que no deberian ir... ******************');
  }
}
}
  
  editarNominacion(nominacion: NominacionModel) {
    console.log(nominacion);
    this.accion = 'editar';
    this.nominacionEditar = nominacion;
    console.log(this.nominacionEditar.titulo)
   this.visibleSide = true;
  }

  async fetchNominacion() {
    await this.getNominaciones();
    this.visibleSide = false;
    this.accion = null;
    this.nominacionEditar = null;
  }

  fileNameFromUrl(url) {
    var matches = url.match(/\/([^\/?#]+)[^\/]*$/);
    if (matches.length > 1) {
      matches[1] = decodeURIComponent(matches[1]);
      return matches[1].substring(6);
    }
    return null;
  }
  excel() {
    this.exportExcel.nomina(this.listNominaciones);
  }
}

interface evaluardata {
  name: string,
  code: string
}


