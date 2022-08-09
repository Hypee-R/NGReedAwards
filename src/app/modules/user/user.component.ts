import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { VariablesService } from '../../services/variablesGL.service';
import { Subscription } from 'rxjs';
import { Toast } from '../../shared/models/toast.model';
import { SwalModel } from '../../shared/models/swal.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [MessageService]
})
export class UserComponent implements OnInit {

  toastSubcripcion: Subscription = new Subscription();
  swalSubcripcion: Subscription = new Subscription();
  constructor(
    private messageService: MessageService,
    private variablesService: VariablesService
  ) {
    // Message / Notification
    this.toastSubcripcion = this.variablesService.toast.subscribe((toast: Toast) => {
      if (toast)
        this.messageService.add({ key: 'toast', severity: toast.estado, summary: toast.titulo, detail: toast.mensaje, life: toast.segundos, closable: false });
    });
    this.swalSubcripcion = this.variablesService.swal.subscribe((swal: SwalModel) => {
      //if (swal) return Swal(swal.titulo, swal.mensaje, swal.estado);
    });
  }

  ngOnInit(): void {
  }

}
