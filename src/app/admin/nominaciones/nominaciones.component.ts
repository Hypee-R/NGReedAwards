import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { NominacionModel } from 'src/app/models/nominacion.model';
import { NominacionService } from 'src/app/services/nominacion.service';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/services/excel.service';
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
  listNominaciones: NominacionModel[] = [];
  body:any;
  cols: any;
  constructor(
    private toastr: ToastrService,
    private nominacionesService: NominacionService,
    private exportExcel: ExcelService
  ) {
    this.body = document.body;
    this.cols = [
      { field: 'titulo', header: 'Titulo' },
      { field: 'nominado', header: 'Nominado' },
      { field: 'categoria', header: 'Categoría' },
      //{ field: 'organizacion', header: 'Organización' },
      { field: 'fechaCreacion', header: 'Fecha Creación' },
      { field: 'fechaActualizacion', header: 'Fecha Actualización' }
    ];

  }

  ngOnInit(): void {
    this.getNominaciones();
  }

  async getNominaciones(){
    this.listNominaciones = await this.nominacionesService.getAllNominaciones();
    if(this.listNominaciones.length > 0){
        this.listNominaciones = this.listNominaciones.filter(x => x.titulo && x.nominado && x.descripcion);
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
