import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reedeventoadmin',
  templateUrl: './reedeventoadmin.component.html',
  styleUrls: ['./reedeventoadmin.component.css'],
  providers: [MessageService]
})
export class ReedEventoAdminComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
