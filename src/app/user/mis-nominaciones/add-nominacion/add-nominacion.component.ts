import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { FileItem } from 'src/app/shared/models/img.model';
import { ToastrService } from 'ngx-toastr';
import { PaisesService } from 'src/app/services/paises.service';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { NominacionService } from 'src/app/services/nominacion.service';
import { CargaImagenesService } from 'src/app/services/cargaImagenes.service';

declare var paypal;

@Component({
  selector: 'app-add-nominacion',
  templateUrl: './add-nominacion.component.html',
  styleUrls: ['./add-nominacion.component.css']
})
export class AddNominacionComponent implements OnInit {

  @ViewChild('paypal', { static: true }) paypalElement : ElementRef;

  producto = {
    descripcion : 'producto en venta',
    precio      : 113.00
  }
  


  nominacionForm: FormGroup;
  submitted: boolean;
  categorias: any[] = [];
  paises: any[] = [];
  archivos: FileItem[] = [];
  fileLogo: FileList;
  fileCDerechos: FileList;
  fileCIntencion: FileList;
  fileMMultimedia: FileList;
  
  

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private toastr: ToastrService,
    private paisesService: PaisesService,
    private variablesGL: VariablesService,
    private nominacionService: NominacionService,
    private cargaImagenesFBService: CargaImagenesService,
  ) {
    this.getCategorias();
    this.getPaises();
   
    
  }

  ngOnInit(): void {
    this.initForm();
    paypal
    .Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: this.producto.descripcion,
              amount     :{
                moneda: 'US',
                value        : this.producto.precio
              }
            }
          ]
        })
      },
      onApprove: async (data, actions) => {
        const order = await actions.order.capture();
        console.log(order.id);
        console.log(order.status);
        console.log(order.purchase_units);
        
        
        this.nominacionForm.controls['statuspago'].setValue("Pago Realizado");
        this.nominacionForm.controls['idpago'].setValue(order.id);
        
        
      },
      onError: err =>{
        this.nominacionForm.controls['statuspago'].setValue("");
        this.nominacionForm.controls['idpago'].setValue("");
      
        console.log(err);
        
      }
    })
    .render( this.paypalElement.nativeElement );
  }


 

  getCategorias(){
    const categoriasCollection = collection(this.firestore, 'categorias');
    collectionData(categoriasCollection).subscribe( (data) => {
      if(data.length > 0){
        this.categorias = data;
        //console.log('data categorias ', this.categorias);
      }
    });
  }

  getPaises(){
      this.paisesService.getPaises().subscribe( (data: any) => {
          if(data.length > 0){
            this.paises = data.sort((a, b) => a.name.common - b.name.common);
            //console.log('data content paises ordenados', this.paises);
          }
      });
  }

  initForm(){
    this.nominacionForm = this.fb.group({
      titulo: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      nominado: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      fileLogoEmpresa: ['', [Validators.required]],
      organizacion: ['', [Validators.required]],
      responsable: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      rsInstagram: ['',[Validators.required]],
      rsTwitter: ['', [Validators.required]],
      rsFacebook: ['', [Validators.required]],
      rsYoutube: ['', [Validators.required]],
      fileCesionDerechos: ['', [Validators.required]],
      fileCartaIntencion: ['', [Validators.required]],
      fileMaterialMultimedia: ['', [Validators.required]],
      statuspago: ['', [Validators.required]],
      idpago: ['', [Validators.required]],
    })
  }

  async crearNominacion(){
    this.submitted = true;
    console.log('form data nominacion ', this.nominacionForm);
    if(this.nominacionForm.valid){
      this.archivos = [];
      this.setListaArchivos(this.fileLogo, "FileLogoEmpresa");
      this.setListaArchivos(this.fileCDerechos, "FileCesionDerechos");
      this.setListaArchivos(this.fileCIntencion, "FileCartaIntencion");
      this.setListaArchivos(this.fileMMultimedia, "FileMaterialMultimedia");
      //Carga las imagenes solo si no se han cargado
      if(!this.variablesGL.endProcessCargaCompleta.value){
        this.cargaImagenesFBService.upload(this.archivos);
      }

      this.variablesGL.endProcessCargaCompleta.subscribe(endProcessUpload => {
        //Aqui ya terminó de subir los archivos al storage y agregar las url a firestore
        if(endProcessUpload){
          this.toastr.success('Archivos cargados con exito!!', 'Success');
          this.saveDataNominacion();
        }
      });
    }
  }

  saveDataNominacion(){
      let imgSave = this.cargaImagenesFBService.idsImageSave;
      let imgError = this.cargaImagenesFBService.idsImageErr;
      if(imgError.length && imgError.length > 0){
        imgError.forEach(imgErr => {
          this.toastr.error('Hubo un error al cargar este archivo! :('+imgErr.img.nombre, 'Error');
        });
        this.archivos = [];
        this.variablesGL.endProcessCargaCompleta.next(false);
      }else{
        this.nominacionService.addNominacion({
          titulo: this.nominacionForm.get('titulo').value,
          categoria: this.nominacionForm.get('categoria').value,
          nominado: this.nominacionForm.get('nominado').value,
          descripcion: this.nominacionForm.get('descripcion').value,
          fileLogoEmpresa: { idFile: imgSave.find(x => x.fileMapped == 'FileLogoEmpresa').idDoc, url: imgSave.find(x => x.fileMapped == 'FileLogoEmpresa').url },
          organizacion: this.nominacionForm.get('organizacion').value,
          responsable: this.nominacionForm.get('responsable').value,
          telefono: this.nominacionForm.get('telefono').value,
          pais: this.nominacionForm.get('pais').value,
          rsInstagram: this.nominacionForm.get('rsInstagram').value,
          rsTwitter: this.nominacionForm.get('rsTwitter').value,
          rsFacebook: this.nominacionForm.get('rsFacebook').value,
          rsYoutube: this.nominacionForm.get('rsYoutube').value,
          fileCesionDerechos: { idFile: imgSave.find(x => x.fileMapped == 'FileCesionDerechos').idDoc, url: imgSave.find(x => x.fileMapped == 'FileCesionDerechos').url },
          fileCartaIntencion: { idFile: imgSave.find(x => x.fileMapped == 'FileCartaIntencion').idDoc, url: imgSave.find(x => x.fileMapped == 'FileCartaIntencion').url },
          materialMultimedia: imgSave.filter(x => x.fileMapped == 'FileMaterialMultimedia').map( (data) => { return { idFile: data.idDoc, url: data.url }} ),
          statuspago: this.nominacionForm.get('statuspago').value,
          idpago: this.nominacionForm.get('idpago').value,
          montopago: this.producto.precio.toString(),
          uid: JSON.parse(localStorage.d).uid
        });

        this.variablesGL.endProcessNominacion.subscribe(endProcessNominacion => {
          if(endProcessNominacion != '' && endProcessNominacion != null){
            this.toastr.success('Nominación creada con exito!!', 'Success');
            this.submitted = false;
            this.nominacionForm.reset();
            this.archivos = [];
            console.log("END PROCESS CREATE");

            this.variablesGL.endProcessCargaCompleta.next(null);
            this.variablesGL.endProcessNominacion.next(null);
          }else if(endProcessNominacion == ''){
            this.toastr.error('Hubo un error al guardar la nominacion! :(', 'Error');
            this.submitted = false;
          }
        });
      }
  }

  onFileSelected(event: any, fileMapped: string){
    switch(fileMapped){
      case "FileLogoEmpresa":
        if(event.target.files.length>0){
          console.log(event.target.files);

          if(this._archivoPuedeSerCargado(event.target.files[0])){
            this.fileLogo = event.target.files;
            this.nominacionForm.get('fileLogoEmpresa').setValue("ya cargo archivo");
          }else{
            event.target.files = null;
            this.toastr.error("Solo puedes cargar imagenes como logo de la organización", "Error");
            this.nominacionForm.get('fileLogoEmpresa').reset();
          }
        }else{
          this.fileLogo = null;
          this.nominacionForm.get('fileLogoEmpresa').reset();
        }
        break;
      case "FileCesionDerechos":
        if(event.target.files.length>0){
          this.fileCDerechos = event.target.files;
          this.nominacionForm.get('fileCesionDerechos').setValue("ya cargo archivo");
        }else{
          this.fileCDerechos = null;
          this.nominacionForm.get('fileCesionDerechos').reset();
        }
        break;
      case "FileCartaIntencion":
        if(event.target.files.length>0){
          this.fileCIntencion = event.target.files;
          this.nominacionForm.get('fileCartaIntencion').setValue("ya cargo archivo");
        }else{
          this.fileCIntencion = null;
          this.nominacionForm.get('fileCartaIntencion').reset();
        }
        break;
      case "FileMaterialMultimedia":
        if(event.target.files.length>0){
          this.fileMMultimedia = event.target.files;
          this.nominacionForm.get('fileMaterialMultimedia').setValue("ya cargo archivo");
        }else{
          this.fileMMultimedia = null;
          this.nominacionForm.get('fileMaterialMultimedia').reset();
        }
        break;
    }
  }

  setListaArchivos(archivosLista: FileList, fileMapped){
    this._extraerArchivos(archivosLista, fileMapped);
    console.log('lista archivos ', this.archivos);
  }

  private _extraerArchivos(archivosLista: FileList, fileMapped: string){
    console.log(archivosLista);

    for (const propiedad in Object.getOwnPropertyNames( archivosLista )) {
      const archivoTemp = archivosLista[propiedad];

      if(fileMapped == "FileLogoEmpresa"){
        if(this._archivoPuedeSerCargado(archivoTemp)){
          const newArchivo = new FileItem(archivoTemp);
          newArchivo.fileMapped = fileMapped;
          this.archivos.push(newArchivo);
        }else{
          this.toastr.error("Solo puedes cargar imagenes como logo de la organización", "Error");
        }
      }else{
          const newArchivo = new FileItem(archivoTemp);
          newArchivo.fileMapped = fileMapped;
          this.archivos.push(newArchivo);
      }
    }
  }

  private _archivoPuedeSerCargado(archivo: File): boolean{
    if(this.esImagen(archivo.type)){
      return true;
    }else{
      return false;
    }
  }

  private esImagen(tipoArchivo: string): boolean{
    return (tipoArchivo === '' || tipoArchivo === undefined) ? false : tipoArchivo.startsWith('image');
  }
  

}
