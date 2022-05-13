import Swal from 'sweetalert2'
import { MenuItem } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { NominacionModel } from 'src/app/models/nominacion.model';
import { NominacionService } from 'src/app/services/nominacion.service';

@Component({
  selector: 'app-nominaciones',
  templateUrl: './nominaciones.component.html',
  styleUrls: ['./nominaciones.component.css']
})
export class NominacionesComponent implements OnInit {

  items: MenuItem[];
  loading: boolean = true;
  listNominaciones: NominacionModel[] = [];
  nominacionUpdate: NominacionModel;
  constructor(
    private toastr: ToastrService,
    private nominacionesService: NominacionService
  ) {
    this.items = [
      { label: 'Pago Realizado', icon: 'pi pi-check-circle', command: () => {
          this.updateEstatusPagoNominacion('Pago Realizado');
      }},
      { label: 'Pago Pendiente', icon: 'pi pi-info-circle', command: () => {
          this.updateEstatusPagoNominacion('Pago Pendiente');
      }},
      {label: 'Pago Rechazado', icon: 'pi pi-times-circle', command: () => {
          this.updateEstatusPagoNominacion('Pago Rechazado');
      }},
      {label: 'Pago No Realizado', icon: 'pi pi-stop-circle', command: () => {
          this.updateEstatusPagoNominacion('Pago No Realizado');
      }},
  ];
  }

  ngOnInit(): void {
    this.getNominaciones();
  }

  async getNominaciones(){
    this.listNominaciones = await this.nominacionesService.getAllNominaciones();
    if(this.listNominaciones.length == 0){
      this.listNominaciones = null;
    }
    this.loading = false;
  }

  vistaPrevia(nominacion){
    if(nominacion.mostrarMas){
       nominacion.mostrarMas = false;
    }else{
       nominacion.mostrarMas = true;
    }
  }

  setNominacionUpdate(nominacion: NominacionModel){
    this.nominacionUpdate = nominacion;
    console.log('set nominacion update ', this.nominacionUpdate);
  }

  updateEstatusPagoNominacion(estatus: string){
    Swal.fire({
      title: 'Actualizar Estatus de Pago?',
      text: "Se cambiará el estatus de pago a: "+estatus,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3c3174',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Actualizar!',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.nominacionUpdate.statuspago = estatus;
        console.log('UPDATE ESTATUS PAGO ', this.nominacionUpdate);
        this.nominacionesService.updateStatusPagoNominacion(this.nominacionUpdate);
        this.toastr.success('Nominación actualizada con exito!!', 'Success');
        this.getNominaciones();
      }
    });

  }



}
