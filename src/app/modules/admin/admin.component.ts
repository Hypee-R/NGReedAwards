import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/config/config.service';
import { VariablesService } from '../../services/variablesGL.service';
import { SwalModel } from '../../shared/models/swal.model';
import { Toast } from '../../shared/models/toast.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [MessageService]
})
export class AdminComponent implements OnInit {

  toastSubcripcion: Subscription = new Subscription();
  swalSubcripcion: Subscription = new Subscription();
  constructor(
    public configService: ConfigService,
    private messageService: MessageService,
    private variablesService: VariablesService
  ) { }

  ngOnInit(): void {

    // Message / Notification
    this.toastSubcripcion = this.variablesService.toast.subscribe((toast: Toast) => {
      if (toast)
        this.messageService.add({ key: 'toast', severity: toast.estado, summary: toast.titulo, detail: toast.mensaje, life: toast.segundos, closable: false });
    });
    this.swalSubcripcion = this.variablesService.swal.subscribe((swal: SwalModel) => {
      //if (swal) return Swal(swal.titulo, swal.mensaje, swal.estado);
    });
  }

}
