import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { NominacionService } from 'src/app/services/nominacion.service';
import { ToastrService } from 'ngx-toastr';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { NominacionModel } from 'src/app/models/nominacion.model';



declare var paypal;

@Component({
  selector: 'app-mis-lugares',
  templateUrl: './mis-lugares.component.html',
  styleUrls: ['./mis-lugares.component.css']
})
export class MisLugaresComponent implements OnInit {

  visibleSide: boolean;
  listlugares: NominacionModel[] = [];
  loading: boolean = true;
  accion: string = '';
  nominacionEditar: any;
  constructor(
    private toastr: ToastrService,
    private lugaresService: NominacionService
  ) {
    this.getlugares();
  }

  ngOnInit(): void {
  }

  async getlugares(){
    this.listlugares = await this.lugaresService.getNominaciones();
    if(this.listlugares.length > 0){
      this.listlugares = this.listlugares.filter(x => x.titulo && x.nominado && x.descripcion);
      //console.log('data ', this.listlugares);
    }
    if(this.listlugares.length == 0){
      this.listlugares = null;
    }
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
        this.lugaresService.deleteNominacion(nominacion);
        this.toastr.success('Nominación eliminada!!', 'Success');
        this.getlugares();
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
    await this.getlugares();
    this.visibleSide = false;
    this.accion = null;
    this.nominacionEditar = null;
  }

}
