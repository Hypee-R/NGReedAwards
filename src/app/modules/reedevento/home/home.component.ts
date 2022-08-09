import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  items: MenuItem[];
  tooltipItems: MenuItem[];
  gfg: MenuItem[];
  mesas:string[]=["1","2","3","4","5","6","7","8","9","10"]
  styleOBJ = {'background': "RGB(217, 222, 224)"}
  leftTooltipItems: MenuItem[];
  constructor() { }

  ngOnInit(): void {
    
   
  }


  
}
