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
 
  selectedNominacion: NominacionModel;
  loading: boolean = true;
  listNominaciones: any[] = [];
  usuarios: any[] = [];
  body: any;
  cols: any;
  value: number = 0;

  userData: any;
  uid = JSON.parse(localStorage.d).uid;
  constructor(
    private firebaseService: CategoriasService,
    private toastr: ToastrService,
    private nominacionesService: NominacionService,
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


