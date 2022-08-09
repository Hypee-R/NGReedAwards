import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ElementRef, ViewChild } from '@angular/core';
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
  toggle = true;
  status = "Enable";
  componetesSelecciondos:ElementRef[]=[];
  leftTooltipItems: MenuItem[];
  constructor() { }
  @ViewChild('MyRef') element: ElementRef;
  @ViewChildren('MyRef') inputsArray: QueryList<ElementRef>
  ngOnInit(): void {
    
   
  }

  selectedAsiento(item){
    console.log(item)
    console.log("ayuda")
    this.toggle = !this.toggle;
    this.status = this.toggle ? "Enable" : "Disable"
    
    this.componetesSelecciondos.push(this.element)
    let toArray = this.inputsArray.toArray()
    let ref: ElementRef<HTMLInputElement> = toArray.find(el => el.nativeElement.id == item)
    ref.nativeElement.style.background="rgb(143, 191, 22)"
    console.log(ref)
  }

  realizarCompra(){
    console.log(this.inputsArray)
  }
  cancelarCompra(){

    for (let item of this.inputsArray){
      item.nativeElement.style.background= "rgb(171, 90, 90)"
    }
  }
  comprarMesa(idMesa){
    let toArray = this.inputsArray.toArray()
    for (let silla of this.mesas){
      let item=idMesa+silla
      let ref: ElementRef<HTMLInputElement> = toArray.find(el => el.nativeElement.id == item)
      ref.nativeElement.style.background="rgb(143, 191, 22)"
    }
    let ref: ElementRef<HTMLInputElement> = toArray.find(el => el.nativeElement.id == idMesa)
    ref.nativeElement.style.background="rgb(143, 191, 22)"
    
  }
  
}
