import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ElementRef, ViewChild } from '@angular/core';
import { Console } from 'console';
import { boleto } from './pago/pago.component';
import { LugaresService } from 'src/app/services/lugares.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  mesas:string[]=["1","2","3","4","5","6","7","8","9","10"]
  mesasN:string[]=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O"]
  styleOBJ = {'background': "RGB(217, 222, 224)"}
  toggle = true;
  status = "Enable";
  componetesSeleccionados:ElementRef[]=[];

  
  @ViewChild('MyRef') element: ElementRef;
  @ViewChildren('MyRef') inputsArray: QueryList<ElementRef>
  mensaje=""
  selectedColor='background-color:rgb(143, 191, 22)'
  unselectedColor='background-color:rgb(171, 90, 90)&:hover:{background: rgb(211, 202, 26)}'
  enableColor='background-color:rgb(178, 178, 178)'
  disbledColor=''
  defaultColor=''
  styleClickOn=''
  visibleSidebar2
  displayBasic: boolean;
  boletosSeleccionados:boleto[]=[]
  cargando=false
  lugares:any


  lugaresDisponibles:boleto[]=[]
  constructor(
    private lugaresService:LugaresService
  ) { 
    //this.getLugares();
  }
  ngOnInit(): void {
   this.getLugares()
   
  }

  async getLugares(){
    this.lugaresService.getLugares().subscribe( (data) => {
      this.lugares = data
      for (let dato of data){
        let lug:boleto={idLugar:dato['idLugar'],precio:dato['precio'],disponible:dato['comprado']}
        this.lugaresDisponibles.push(lug)
        
      }
     // console.log(this.lugares)
     
     this.cargando=true
     this.initLugares()
    }, err => {
      
    });
    
  }
  initLugares(){
    if(this.cargando){
      
      let toArray = this.inputsArray.toArray()
      for (let lugar of this.lugaresDisponibles){
        let ref: ElementRef<HTMLInputElement> = toArray.find(el => el.nativeElement.id == lugar.idLugar)
        if(!lugar.disponible){
          ref.nativeElement.setAttribute('style', this.unselectedColor)
        }
        else{
          ref.nativeElement.setAttribute('style', this.enableColor)
          
        }      
      }
    }
  
  }
 
  selectedAsiento(item){
    let disponible= this.lugaresDisponibles.find(el=>el.idLugar==item)
  
    if(!disponible.disponible)
    {

      let toArray = this.inputsArray.toArray()
      let ref: ElementRef<HTMLInputElement> = toArray.find(el => el.nativeElement.id == item)
      let status=this.componetesSeleccionados.find(el=>el.nativeElement.id==ref.nativeElement.id)
      if(!status){
        this.componetesSeleccionados.push(ref)
        ref.nativeElement.setAttribute('style', this.selectedColor)
      }
      else{
        this.componetesSeleccionados=this.componetesSeleccionados.filter(item=>item.nativeElement.id!=ref.nativeElement.id)
        ref.nativeElement.setAttribute('style', this.unselectedColor)
      }
    }
   
  
  
  }

  realizarCompra(){
    if(this.componetesSeleccionados.length>0){
      this.visibleSidebar2=true;
      for(let boleto of this.componetesSeleccionados){
        let newBoleto={"idLugar":boleto.nativeElement.id,"precio":"575USD","disponible":true}
        this.boletosSeleccionados.push(newBoleto)
      }
    }
    else{
      console.log("selecciona un asiento")
      this.displayBasic = true;
    }
  }
  unseled(){
    this.boletosSeleccionados=[]
  }
  cancelarCompra(){

    for (let item of this.inputsArray){
      
      item.nativeElement.setAttribute('style', this.unselectedColor) 
    }
    this.componetesSeleccionados=[]
    this.boletosSeleccionados=[]
  }
  comprarMesa(idMesa){
    let toArray = this.inputsArray.toArray()
    let colorMesa=false
    for (let silla of this.mesas){
      let item=idMesa+silla
      let ref: ElementRef<HTMLInputElement> = toArray.find(el => el.nativeElement.id == item)
      let status=this.componetesSeleccionados.find(el=>el.nativeElement.id==ref.nativeElement.id)
      if(!status){
        this.componetesSeleccionados.push(ref)
        ref.nativeElement.setAttribute('style', this.selectedColor)
        colorMesa=true
      }
      else{
        this.componetesSeleccionados=this.componetesSeleccionados.filter(item=>item.nativeElement.id!=ref.nativeElement.id)
        ref.nativeElement.setAttribute('style', this.unselectedColor)
        colorMesa=false
      }      
     
    }
    let ref: ElementRef<HTMLInputElement> = toArray.find(el => el.nativeElement.id == idMesa)
    if(colorMesa){
      ref.nativeElement.setAttribute('style', this.selectedColor) 
    }
    else{
      ref.nativeElement.setAttribute('style', this.unselectedColor)
    }
    
    
  }
  showBasicDialog() {
    this.displayBasic = true;
}

  
}
