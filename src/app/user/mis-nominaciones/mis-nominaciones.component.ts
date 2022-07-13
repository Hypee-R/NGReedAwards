import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { NominacionService } from 'src/app/services/nominacion.service';
import { ToastrService } from 'ngx-toastr';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { NominacionModel } from 'src/app/models/nominacion.model';



declare var paypal;

@Component({
  selector: 'app-mis-nominaciones',
  templateUrl: './mis-nominaciones.component.html',
  styleUrls: ['./mis-nominaciones.component.css']
})
export class MisNominacionesComponent implements OnInit {

  visibleSide: boolean;
  listNominaciones: NominacionModel[] = [];
  loading: boolean = true;
  accion: string = '';
  nominacionEditar: any;
  constructor(
    private toastr: ToastrService,
    private nominacionesService: NominacionService
  ) {
    this.getNominaciones();
  }

  ngOnInit(): void {
  }

  async getNominaciones(){
    this.listNominaciones = await this.nominacionesService.getNominaciones();
    if(this.listNominaciones.length > 0){
      this.listNominaciones = this.listNominaciones.filter(x => x.titulo && x.nominado && x.descripcion);
      //console.log('data ', this.listNominaciones);
    }
    if(this.listNominaciones.length == 0){
      this.listNominaciones = null;
    }
    this.loading = false;
    // .subscribe( data => {
    //     if(data){
    //       this.listNominaciones = data;
    //       this.listNominaciones.forEach( (element: QueryDocumentSnapshot) => {
    //         console.log('data nominaciones ', element.data());
    //       });
    //       if(this.listNominaciones.length == 0){
    //         this.listNominaciones = null;
    //       }
    //       this.loading = false;
    //     }
    // },
    // err => {
    //   this.toastr.error('Hubo un problema al obtener las nominaciones, intentelo más tarde...','Error')
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

  vistaPrevia(nominacion){
     if(nominacion.mostrarMas){
        nominacion.mostrarMas = false;
     }else{
        nominacion.mostrarMas = true;
     }
  }

  async fetchNominacion(){
    await this.getNominaciones();
    this.visibleSide = false;
    this.accion = null;
    this.nominacionEditar = null;
  }

}
