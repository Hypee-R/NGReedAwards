import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { NominacionModel } from 'src/app/models/nominacion.model';
import { NominacionService } from 'src/app/services/nominacion.service';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/services/excel.service';
import { UsuarioService } from '../../services/usuarios.service';
@Component({
  selector: 'app-nominaciones',
  templateUrl: './nominaciones.component.html',
  styleUrls: ['./nominaciones.component.css']
})
export class NominacionesComponent implements OnInit {

  visibleSide: boolean;
  accion: string = '';
  nominacionEditar: NominacionModel;
  selectedNominacion: NominacionModel;
  loading: boolean = true;
  listNominaciones: any[] = [];
  usuarios: any[] = [];
  body:any;
  cols: any;
  constructor(
    private toastr: ToastrService,
    private nominacionesService: NominacionService,
    private usuariosService: UsuarioService,
    private exportExcel: ExcelService
  ) {
    this.usuariosService.getusuarios().subscribe(data => {
      this.usuarios = data;
      //console.log('usuarios ', this.usuarios);
      this.getNominaciones();
    });
    this.body = document.body;
    this.cols = [
      { field: 'titulo', header: 'Titulo' , filter: 'titulo'},
      { field: 'nominado', header: 'Nominado' , filter: 'nominado'},
      { field: 'categoria', header: 'Categoría' , filter: 'categoria'},
      { field: 'fechaCreacion', header: 'Fecha Creación' , filter: 'fechaCreacion'},
      { field: 'fechaActualizacion', header: 'Fecha Actualización' , filter: 'fechaActualizacion'},
      // { field: 'displayName', header: 'Usuario Nombre', filter: 'usuario.displayName'},
      { field: 'email', header: 'Usuario Correo', filter: 'usuario.email' }
    ];

  }

  ngOnInit(): void {
  }

  async getNominaciones(){
    this.listNominaciones = await this.nominacionesService.getAllNominaciones();
    if(this.listNominaciones.length > 0){
        this.listNominaciones = this.listNominaciones.filter(x => x.titulo && x.nominado && x.descripcion);
        this.listNominaciones.forEach(item => {
            let usuario = this.usuarios.find(x => x.uid == item.uid);
            item.usuario = usuario;
        });
    }
    if(this.listNominaciones.length == 0){
      this.listNominaciones = null;
    }
    this.loading = false;
    console.log('data ', this.listNominaciones);

  }

  vistaPrevia(nominacion){
    if(nominacion.mostrarMas){
       nominacion.mostrarMas = false;
    }else{
       nominacion.mostrarMas = true;
    }
  }

  async eliminarNominacion(nominacion: NominacionModel){
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
        this.nominacionesService.deleteNominacion(nominacion);
        this.toastr.success('Nominación eliminada!!', 'Success');
        this.getNominaciones();
      }
    });
  }

  editarNominacion(nominacion: NominacionModel){
    this.accion = 'editar';
    this.nominacionEditar = nominacion;
    this.visibleSide = true;
  }

  async fetchNominacion(){
    await this.getNominaciones();
    this.visibleSide = false;
    this.accion = null;
    this.nominacionEditar = null;
  }


excel(){

    this.exportExcel.nomina(this.listNominaciones)
}
}
