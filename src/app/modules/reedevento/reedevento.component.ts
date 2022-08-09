import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reedevento',
  templateUrl: './reedevento.component.html',
  styleUrls: ['./reedevento.component.css'],
  providers: [MessageService]
})
export class ReedEventoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
