import { ToastrService } from 'ngx-toastr';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FileItem } from 'src/app/shared/models/img.model';
import { PaisesService } from 'src/app/services/paises.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { NominacionService } from 'src/app/services/nominacion.service';
import { CargaImagenesService } from 'src/app/services/cargaImagenes.service';
import { Firestore, collectionData, collection, query, orderBy } from '@angular/fire/firestore';
import { CategoriasService } from 'src/app/services/categorias.service';

declare var paypal;

@Component({
  selector: 'app-add-nominacion',
  templateUrl: './add-nominacion.component.html',
  styleUrls: ['./add-nominacion.component.css']
})
export class AddNominacionComponent implements OnInit {

  @ViewChild('paypal', { static: true }) paypalElement : ElementRef;
  @Input() accion: string;
  @Input() nominacionEditar: any;
  @Output() fetchNominaciones: EventEmitter<boolean> = new EventEmitter<boolean>()

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
  agregarLogo: boolean = true;
  agregarFileCDerechos: boolean = true;
  agregarFileCIntencion: boolean = true;
  agregarFilesMultimedia: boolean = true;
  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private toastr: ToastrService,
    private paisesService: PaisesService,
    private variablesGL: VariablesService,
    private nominacionService: NominacionService,
    private categoriasService: CategoriasService,
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
    this.categoriasService.getCategorias().subscribe( (data) => {
      if(data.length > 0){
        this.categorias = data;
        //console.log('data categorias ', this.categorias);
        if(this.accion == 'editar'){
          this.agregarLogo = false;
          this.agregarFileCDerechos = false;
          this.agregarFileCIntencion = false;
          this.agregarFilesMultimedia = false;
          this.setValueForm();
        }
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
      statuspago: ['', []],
      idpago: ['', []],
    })
  }

  setValueForm(){
    let searchCat = this.categorias.find(x => x.nombre == this.nominacionEditar.categoria);
    console.log('CATEGORIA ENCONTRADA ', searchCat, this.nominacionEditar.categoria, this.categorias.length);

    this.nominacionForm.patchValue({
      titulo: this.nominacionEditar.titulo,
      categoria: searchCat.nombre,
      nominado: this.nominacionEditar.nominado,
      descripcion: this.nominacionEditar.descripcion,
      fileLogoEmpresa: this.nominacionEditar?.fileLogoEmpresa?.url ? 'ya cargo archivo' : '',
      organizacion: this.nominacionEditar.organizacion,
      responsable: this.nominacionEditar.responsable,
      telefono: this.nominacionEditar.telefono,
      pais: this.nominacionEditar.pais,
      rsInstagram: this.nominacionEditar.rsInstagram,
      rsTwitter: this.nominacionEditar.rsTwitter,
      rsFacebook: this.nominacionEditar.rsFacebook,
      rsYoutube: this.nominacionEditar.rsYoutube,
      fileCesionDerechos: this.nominacionEditar?.fileCesionDerechos?.url ? 'ya cargo archivo' : '',
      fileCartaIntencion: this.nominacionEditar?.fileCartaIntencion?.url ? 'ya cargo archivo' : '',
      fileMaterialMultimedia: this.nominacionEditar.materialMultimedia,
      statuspago: this.nominacionEditar.statuspago,
      idpago: this.nominacionEditar.idpago,
    });
  }

  crearNominacion(){
    this.submitted = true;
    //console.log('form data nominacion ', this.nominacionForm);
    if(this.nominacionForm.valid){
      this.toastr.info('Espera un momento, se está guardando la información!!', 'Espera');

      if(this.accion == 'agregar'){
        this.archivos = [];
        this.setListaArchivos(this.fileLogo, "FileLogoEmpresa");
        this.setListaArchivos(this.fileCDerechos, "FileCesionDerechos");
        this.setListaArchivos(this.fileCIntencion, "FileCartaIntencion");
        this.setListaArchivos(this.fileMMultimedia, "FileMaterialMultimedia");
        //Carga las imagenes solo si no se han cargado
        if(!this.variablesGL.endProcessCargaCompleta.value){
          this.cargaImagenesFBService.upload(this.archivos);
        }
      }else{
        //Si no desea modificar ningun archivo se salta el upload
        if(!this.agregarLogo && !this.agregarFileCDerechos && !this.agregarFileCIntencion && !this.agregarFilesMultimedia){
            this.variablesGL.endProcessCargaCompleta.next(true);
        }
        //Si desea modificar algun archivo lo carga
        else{
            this.archivos = [];
            if(this.agregarLogo){
              this.setListaArchivos(this.fileLogo, "FileLogoEmpresa");
            }
            if(this.agregarFileCDerechos){
              this.setListaArchivos(this.fileCDerechos, "FileCesionDerechos");
            }
            if(this.agregarFileCIntencion){
              this.setListaArchivos(this.fileCIntencion, "FileCartaIntencion");
            }
            if(this.agregarFilesMultimedia){
              this.setListaArchivos(this.fileMMultimedia, "FileMaterialMultimedia");
            }
            //Carga las imagenes solo si no se han cargado
            if(!this.variablesGL.endProcessCargaCompleta.value){
              this.cargaImagenesFBService.upload(this.archivos);
              console.log("Entro a cargar los archivos al actualizar");

            }
        }
      }

      this.variablesGL.endProcessCargaCompleta.subscribe(endProcessUpload => {
        //Aqui ya terminó de subir los archivos al storage y agregar las url a firestore
        if(endProcessUpload){
          this.toastr.success('Archivos cargados con exito!!', 'Success');
          if(this.accion == 'agregar'){
            this.saveDataNominacion();
            console.log("ACCION AGREGAR");

          }else{
            this.updateDataNominacion();
            console.log("ACCION EDITAR");

          }
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
          id: Date.now().toString(),
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
            this.fetchNominaciones.emit(true);
          }else if(endProcessNominacion == ''){
            this.toastr.error('Hubo un error al guardar la nominacion!', 'Error');
            this.submitted = false;
          }
        });
      }
  }

  async updateDataNominacion(){
      let imgSave = this.cargaImagenesFBService.idsImageSave;
      let imgError = this.cargaImagenesFBService.idsImageErr;
      if(imgError.length && imgError.length > 0){
        imgError.forEach(imgErr => {
          this.toastr.error('Hubo un error al cargar este archivo! :('+imgErr.img.nombre, 'Error');
        });
        this.archivos = [];
        this.variablesGL.endProcessCargaCompleta.next(false);
      }else{
        await this.nominacionService.updateNominacion({
          id: this.nominacionEditar.id,
          titulo: this.nominacionForm.get('titulo').value,
          categoria: this.nominacionForm.get('categoria').value,
          nominado: this.nominacionForm.get('nominado').value,
          descripcion: this.nominacionForm.get('descripcion').value,
          fileLogoEmpresa: this.agregarLogo ? { idFile: imgSave.find(x => x.fileMapped == 'FileLogoEmpresa').idDoc, url: imgSave.find(x => x.fileMapped == 'FileLogoEmpresa').url } : this.nominacionEditar.fileLogoEmpresa,
          organizacion: this.nominacionForm.get('organizacion').value,
          responsable: this.nominacionForm.get('responsable').value,
          telefono: this.nominacionForm.get('telefono').value,
          pais: this.nominacionForm.get('pais').value,
          rsInstagram: this.nominacionForm.get('rsInstagram').value,
          rsTwitter: this.nominacionForm.get('rsTwitter').value,
          rsFacebook: this.nominacionForm.get('rsFacebook').value,
          rsYoutube: this.nominacionForm.get('rsYoutube').value,
          fileCesionDerechos: this.agregarFileCDerechos ? { idFile: imgSave.find(x => x.fileMapped == 'FileCesionDerechos').idDoc, url: imgSave.find(x => x.fileMapped == 'FileCesionDerechos').url } : this.nominacionEditar.fileCesionDerechos,
          fileCartaIntencion: this.agregarFileCIntencion ? { idFile: imgSave.find(x => x.fileMapped == 'FileCartaIntencion').idDoc, url: imgSave.find(x => x.fileMapped == 'FileCartaIntencion').url } : this.nominacionEditar.fileCartaIntencion,
          materialMultimedia: this.agregarFilesMultimedia ? imgSave.filter(x => x.fileMapped == 'FileMaterialMultimedia').map( (data) => { return { idFile: data.idDoc, url: data.url }} ) : this.nominacionEditar.materialMultimedia,
          statuspago: this.nominacionForm.get('statuspago').value,
          idpago: this.nominacionForm.get('idpago').value ? this.nominacionForm.get('idpago').value : Date.now().toString(),
          montopago: this.producto.precio.toString(),
          uid: JSON.parse(localStorage.d).uid
        });

        this.toastr.success('Nominación actualizada con exito!!', 'Success');
        this.submitted = false;
        this.nominacionForm.reset();
        this.archivos = [];
        console.log("END PROCESS UPDATE");
        this.fetchNominaciones.emit(true);

        this.variablesGL.endProcessCargaCompleta.next(null);
        this.variablesGL.endProcessNominacion.next(null);

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

  cambiarArchivo(fileMapped: string){
    switch(fileMapped){
      case 'FileLogoEmpresa':
          this.agregarLogo = true;
          this.nominacionForm.get('fileLogoEmpresa').reset();
        break;
      case 'FileCesionDerechos':
          this.agregarFileCDerechos = true;
          this.nominacionForm.get('fileCesionDerechos').reset();
        break;
      case 'FileCartaIntencion':
          this.agregarFileCIntencion = true;
          this.nominacionForm.get('fileCartaIntencion').reset();
        break;
      case 'FileMaterialMultimedia':
          this.agregarFilesMultimedia = true;
          this.nominacionForm.get('fileMaterialMultimedia').reset();
        break;
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
