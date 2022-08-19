import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ElementRef, ViewChild } from '@angular/core';
import { Console } from 'console';
import { boleto } from './pago/pago.component';
import { LugaresService } from 'src/app/services/lugares.service';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { map, Observable, shareReplay, timer } from 'rxjs';
import { DatePipe } from '@angular/common'

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


  @ViewChildren('MyRef') inputsArray: QueryList<ElementRef>
  selectedColor='background-color:rgb(143, 191, 22)'
  unselectedColor='background-color:rgb(171, 90, 90)&:hover:{background: rgb(211, 202, 26)}'
  enableColor='background-color:rgb(178, 178, 178)'
  disbledColor=''
  defaultColor=''
  styleClickOn=''
  visibleSidebar2=false
  displayBasic: boolean;
  boletosSeleccionados:boleto[]=[]
  cargando=false
  lugares:any
  lugaresDisponibles:boleto[]=[]
  clock: any;
  source = timer(0, 1000);
  end: any;
  now: Date;
  diferencia:number;
  mesa:boolean=true;
  constructor(
    private lugaresService:LugaresService,
    public datepipe: DatePipe
  ) { 
    
    this.getLugares();
    this.clock = this.source.subscribe(t => {
      this.now = new Date();
    });
   
  }
  ngOnInit(): void {
 
 
  }
  
  async getLugares(){
     await this.lugaresService.getLugares().subscribe( (data) => {
      this.lugares = data
      this.lugaresDisponibles=[]
      for (let dato of data){
        let lug:boleto  ={idLugar:dato['idLugar'],precio:dato['precio'],comprado:dato['comprado'],apartado:dato['apartado'],hora:dato['fecha']}
        this.lugaresDisponibles.push(lug)
      }
     
    this.initLugares()
    this.cargando=true
    }, err => {
      
    });
    
  }
  initLugares(){
      let toArray = this.inputsArray.toArray()
      for (let lugar of this.lugaresDisponibles){
        if(lugar.hora){
          let f=lugar.hora.toString()
          let newDate = new Date(f);
          this.diferencia =  (this.now.getTime()-newDate.getTime())/60000;   
        }
        let ref: ElementRef<HTMLInputElement> = toArray.find(el => el.nativeElement.id == lugar.idLugar)
        if(lugar.apartado||lugar.comprado){ 
          if(lugar.comprado){
            
            ref.nativeElement.setAttribute('style', this.enableColor)
          }
          else{

            if(lugar.apartado){
              if(!lugar.comprado && this.diferencia>2)
              {
                this.cancelarApartado(lugar)
                ref.nativeElement.setAttribute('style', this.enableColor)
              }
              ref.nativeElement.setAttribute('style', this.enableColor)
            }
          }
        
        }
        else{
          ref.nativeElement.setAttribute('style', this.unselectedColor)
        }
        
      }
  
  }
 
  selectedAsiento(item){
    
    let disponiblidad= this.lugaresDisponibles.find(el=>el.idLugar==item)
    if(!disponiblidad.comprado&&!disponiblidad.apartado)
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

  cancelarApartado(boleto:boleto){
      this.lugaresService.cancelarLugarAparatdo(boleto)
    }

  realizarCompra(){
    if(this.componetesSeleccionados.length>0){


      for(let boleto of this.componetesSeleccionados){
        let newBoleto={"idLugar":boleto.nativeElement.id,"precio":"575USD","comprado":false,"apartado":false,"hora":this.now.toLocaleString('en-US')}
        let estatus=this.lugaresService.getLugaresPagados(newBoleto)

        
      } 



      this.visibleSidebar2=true;
      for(let boleto of this.componetesSeleccionados){
        let newBoleto={"idLugar":boleto.nativeElement.id,"precio":"575USD","comprado":false,"apartado":false,"hora":this.now.toLocaleString('en-US')}
        this.boletosSeleccionados.push(newBoleto)
      }
      this.actualizarBoleto()
      
    }
    else{
      this.displayBasic = true;
    }
  
  }

  unseled()
  {
    this.boletosSeleccionados=[]
    this.componetesSeleccionados=[]
  }
  cancelarCompra(){

    for (let item of this.inputsArray){
      
      item.nativeElement.setAttribute('style', this.unselectedColor) 
    }
    this.componetesSeleccionados=[]
    this.boletosSeleccionados=[]
  }

  actualizarBoleto(){

      this.lugaresService.updatelugarApartado(this.boletosSeleccionados)

  
  }

  comprarMesa(idMesa){
    ///console.log(idMesa+"0")
    let disponiblidad= this.lugaresDisponibles.find(el=>el.idLugar==idMesa+"1")
    if(!disponiblidad.comprado&&!disponiblidad.apartado)
    {
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
  }
  showBasicDialog() {
    this.displayBasic = true;
}


}
