import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';
import { Component, ElementRef, EventEmitter,
  Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FileItem } from 'src/app/models/img.model';
import { PaisesService } from 'src/app/services/paises.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VariablesService } from 'src/app/services/variablesGL.service';
import { NominacionService } from 'src/app/services/nominacion.service';
import { CargaImagenesService } from 'src/app/services/cargaImagenes.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { CategoriaModel } from '../../../../models/categoria.model';
import { MenuItem } from 'primeng/api';
import { NominacionModel } from 'src/app/models/nominacion.model';

declare var paypal;

@Component({
  selector: 'app-add-nominacion-admin',
  templateUrl: './add-nominacion.component.html',
  styleUrls: ['./add-nominacion.component.css']
})
export class AddNominacionAdminComponent implements OnInit, OnDestroy {

  @ViewChild('paypal', { static: true }) paypalElement : ElementRef;
  @Input() accion: string;
  @Input() nominacionEditar: any;
  @Output() fetchNominaciones: EventEmitter<boolean> = new EventEmitter<boolean>()

  producto = {
    descripcion : 'producto en venta',
    precio      : 120.75
  }



  nominacionForm: FormGroup;
  submitted: boolean;
  guardando: boolean = false;
  categorias: any[] = [];
  paises: any[] = [];
  filesSave: any[] = [];
  archivos: FileItem[] = [];
  fileLogo: FileList;
  fileCDerechos: FileList;
  fileCIntencion: FileList;
  fileMMultimedia: FileList;
  addOnlyOneFileMultimedia: boolean = false;
  fileBaucher: FileList;
  agregarLogo: boolean = true;
  agregarFileCDerechos: boolean = true;
  agregarFileCIntencion: boolean = true;
  agregarFilesMultimedia: boolean = true;
  agregarFileBaucher: boolean = true;
  preloadCategoria: CategoriaModel;
  items: MenuItem[];
  nominacionUpdate: NominacionModel;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private paisesService: PaisesService,
    private variablesGL: VariablesService,
    private nominacionService: NominacionService,
    private categoriasService: CategoriasService,
    private cargaImagenesFBService: CargaImagenesService,
  ) {
    this.getCategorias();
    this.getPaises();
    this.items = [
      { label: 'Pago Realizado', icon: 'pi pi-check-circle', command: () => {
          this.updateEstatusPagoNominacion('Pago Realizado');
      }},
      { label: 'Pago Pendiente', icon: 'pi pi-info-circle', command: () => {
          this.updateEstatusPagoNominacion('Pago Pendiente');
      }},
      {label: 'Pago Rechazado', icon: 'pi pi-times-circle', command: () => {
          this.updateEstatusPagoNominacion('Pago Rechazado');
      }},
      {label: 'Pago No Realizado', icon: 'pi pi-stop-circle', command: () => {
          this.updateEstatusPagoNominacion('Pago No Realizado');
      }},
    ];
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

  ngOnDestroy(): void {
      this.variablesGL.preloadCategoria.next(null);
  }

  getCategorias(){
    this.categoriasService.getCategorias().subscribe( (data) => {
      if(data.length > 0){
        this.categorias = data;
        this.preloadCategoria = this.variablesGL.preloadCategoria.getValue();
        if(this.preloadCategoria){
          this.nominacionForm.patchValue({
            categoria: this.preloadCategoria.nombre,
          });
        }
        //console.log('data categorias ', this.categorias);
        if(this.accion == 'editar'){
          this.agregarLogo = false;
          this.agregarFileCDerechos = false;
          this.agregarFileCIntencion = false;
          this.agregarFilesMultimedia = false;
          this.agregarFileBaucher = false;
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
      fileBaucher: ['', []],
      pagarCon: ['paypal', [Validators.required]],
      statuspago: ['', []],
      idpago: ['', []],
    });
  }

  setValueForm(){
    let searchCat = this.categorias.find(x => x.nombre == this.nominacionEditar.categoria);
    //console.log('CATEGORIA ENCONTRADA ', searchCat, this.nominacionEditar.categoria, this.categorias.length);

    setTimeout(() => {
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
        fileBaucher: this.nominacionEditar?.fileBaucher?.url ? 'ya cargo archivo' : '',
        pagarCon: this.nominacionEditar.pagarCon,
        statuspago: this.nominacionEditar.statuspago,
        idpago: this.nominacionEditar.idpago,
      });
    }, 100);
  }

  crearNominacion(){
    this.submitted = true;
    //console.log('form data nominacion ', this.nominacionForm);
    if(this.nominacionForm.valid){
      this.toastr.info('Espera un momento, se está guardando la información!!', 'Espera');
      this.guardando = true;

      if(this.accion == 'agregar'){
        this.archivos = [];
        this.setListaArchivos(this.fileLogo, "FileLogoEmpresa");
        this.setListaArchivos(this.fileCDerechos, "FileCesionDerechos");
        this.setListaArchivos(this.fileCIntencion, "FileCartaIntencion");
        this.setListaArchivos(this.fileMMultimedia, "FileMaterialMultimedia");

        if (this.fileBaucher) {
          this.setListaArchivos(this.fileBaucher, "FileBaucher");
          console.log('file baucher ', this.fileBaucher);
        }
        else {
          //this.setListaArchivos(this.fileBaucher, "NoFileBaucher");
          if(this.nominacionForm.get('pagarCon').value != 'paypal'){
            this.toastr.warning('No seleccionaste un archivo de baucher', 'Atención');
          }
          //return;
        }
        //Carga las imagenes solo si no se han cargado
        if(!this.variablesGL.endProcessCargaCompleta.value){
          this.cargaImagenesFBService.upload(this.archivos);
        }
      }else{
        //Si no desea modificar ningun archivo se salta el upload
        if(!this.agregarLogo && !this.agregarFileCDerechos && !this.agregarFileCIntencion && !this.agregarFilesMultimedia && !this.agregarFileBaucher){
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
            if(this.agregarFileBaucher){
              if(this.fileBaucher){
                this.setListaArchivos(this.fileBaucher, "FileBaucher");
              }
            }
            //Carga las imagenes solo si no se han cargado
            if(this.archivos.length > 0){
              this.cargaImagenesFBService.upload(this.archivos);
              //console.log("Entro a cargar los archivos al actualizar ", this.archivos.length);
            }else{
              this.variablesGL.endProcessCargaCompleta.next(true);
            }

        }
      }

      this.variablesGL.endProcessCargaCompleta.subscribe(endProcessUpload => {
        //Aqui ya terminó de subir los archivos al storage y agregar las url a firestore
        if(endProcessUpload){
          if(this.archivos.length > 0){
            this.toastr.success(this.archivos.length+' Archivos cargados con exito!!', 'Success');
          }
          if(this.accion == 'agregar'){
            this.saveDataNominacion();
            //console.log("ACCION AGREGAR");
          }else{
            this.updateDataNominacion();
            //console.log("ACCION EDITAR");
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
        const dataNominacion: NominacionModel = {
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
          // fileBaucher: { idFile: imgSave.find(x => x.fileMapped == 'FileBaucher').idDoc, url: imgSave.find(x => x.fileMapped == 'FileBaucher').url },
          fileBaucher: imgSave.find(x => x.fileMapped == 'FileBaucher') ? { idFile: imgSave.find(x => x.fileMapped == 'FileBaucher').idDoc, url: imgSave.find(x => x.fileMapped == 'FileBaucher').url } : '',
          pagarCon: this.nominacionForm.get('pagarCon').value,
          statuspago: this.nominacionForm.get('statuspago').value,
          idpago: this.nominacionForm.get('idpago').value,
          montopago: this.producto.precio.toString(),
          uid: JSON.parse(localStorage.d).uid,
          fechaCreacion: "",
          fechaActualizacion: ""
        }

        if(dataNominacion.titulo && dataNominacion.nominado && dataNominacion.descripcion){
          this.nominacionService.addNominacion(dataNominacion);
        }

        this.variablesGL.endProcessNominacion.subscribe(endProcessNominacion => {
          if(endProcessNominacion != '' && endProcessNominacion != null){
            this.toastr.success('Nominación creada con exito!!', 'Success');
            this.submitted = false;
            this.guardando = false;
            this.nominacionForm.reset();
            this.archivos = [];
            console.log("END PROCESS CREATE");

            this.variablesGL.endProcessCargaCompleta.next(null);
            this.variablesGL.endProcessNominacion.next(null);
            this.fetchNominaciones.emit(true);
          }else if(endProcessNominacion == ''){
            this.toastr.error('Hubo un error al guardar la nominacion!', 'Error');
            this.submitted = false;
            this.guardando = false;
          }
        });
      }
  }

  async updateDataNominacion(){
      this.filesSave = [];
      this.filesSave = this.cargaImagenesFBService.idsImageSave;
      let imgError = this.cargaImagenesFBService.idsImageErr;
      if(imgError.length && imgError.length > 0){
        imgError.forEach(imgErr => {
          this.toastr.error('Hubo un error al cargar este archivo! :('+imgErr.img.nombre, 'Error');
        });
        this.archivos = [];
        this.variablesGL.endProcessCargaCompleta.next(false);
      }else{
        let dataNominacion = {
          id: this.nominacionEditar.id,
          titulo: this.nominacionForm.get('titulo').value,
          categoria: this.nominacionForm.get('categoria').value,
          nominado: this.nominacionForm.get('nominado').value,
          descripcion: this.nominacionForm.get('descripcion').value,
          fileLogoEmpresa: this.agregarLogo ? { idFile: this.filesSave.find(x => x.fileMapped == 'FileLogoEmpresa').idDoc, url: this.filesSave.find(x => x.fileMapped == 'FileLogoEmpresa').url } : this.nominacionEditar.fileLogoEmpresa,
          organizacion: this.nominacionForm.get('organizacion').value,
          responsable: this.nominacionForm.get('responsable').value,
          telefono: this.nominacionForm.get('telefono').value,
          pais: this.nominacionForm.get('pais').value,
          rsInstagram: this.nominacionForm.get('rsInstagram').value,
          rsTwitter: this.nominacionForm.get('rsTwitter').value,
          rsFacebook: this.nominacionForm.get('rsFacebook').value,
          rsYoutube: this.nominacionForm.get('rsYoutube').value,
          fileCesionDerechos: this.agregarFileCDerechos ? { idFile: this.filesSave.find(x => x.fileMapped == 'FileCesionDerechos').idDoc, url: this.filesSave.find(x => x.fileMapped == 'FileCesionDerechos').url } : this.nominacionEditar.fileCesionDerechos,
          fileCartaIntencion: this.agregarFileCIntencion ? { idFile: this.filesSave.find(x => x.fileMapped == 'FileCartaIntencion').idDoc, url: this.filesSave.find(x => x.fileMapped == 'FileCartaIntencion').url } : this.nominacionEditar.fileCartaIntencion,
          materialMultimedia: this.agregarFilesMultimedia ? this.setFilesMultimedia() : this.nominacionEditar.materialMultimedia,
          // fileBaucher: this.agregarFileBaucher ? { idFile: imgSave.find(x => x.fileMapped == 'FileBaucher').idDoc, url: imgSave.find(x => x.fileMapped == 'FileBaucher').url } : this.nominacionEditar.fileBaucher,
          // fileBaucher: imgSave.find(x => x.fileMapped == 'FileBaucher') ? { idFile: imgSave.find(x => x.fileMapped == 'FileBaucher').idDoc, url: imgSave.find(x => x.fileMapped == 'FileBaucher').url } : '',
          fileBaucher: this.filesSave.find(x => x.fileMapped == 'FileBaucher') ? { idFile: this.filesSave.find(x => x.fileMapped == 'FileBaucher').idDoc, url: this.filesSave.find(x => x.fileMapped == 'FileBaucher').url } : this.nominacionEditar.fileBaucher,
          pagarCon: this.nominacionForm.get('pagarCon').value,
          statuspago: this.nominacionForm.get('statuspago').value,
          idpago: this.nominacionForm.get('idpago').value ? this.nominacionForm.get('idpago').value : Date.now().toString(),
          // montopago: this.producto.precio.toString(),
          montopago: this.nominacionEditar.montopago,
          uid: this.nominacionEditar.uid,
          fechaCreacion: this.nominacionEditar.fechaCreacion,
          fechaActualizacion: ""
        }

        if(dataNominacion.titulo && dataNominacion.nominado && dataNominacion.descripcion){
          await this.nominacionService.updateNominacion(dataNominacion);
          this.toastr.success('Nominación actualizada con exito!!', 'Success');
          console.log("END PROCESS UPDATE");
          this.fetchNominaciones.emit(true);
        }else{
          console.log('********** datos vacios, que no deberian ir... ******************');
        }
        this.submitted = false;
        this.guardando = false;
        this.nominacionForm.reset();
        this.archivos = [];

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
        case "FileBaucher":
          this.agregarFileBaucher = true;
          if(event.target.files.length>0){
            this.fileBaucher = event.target.files;
            this.nominacionForm.get('fileBaucher').setValue("ya cargo archivo");
          }else{
            this.fileBaucher = null;
            console.log("fileBaucher", this.fileBaucher);
            this.nominacionForm.get('fileBaucher').reset();
          }
          break;
    }
  }

  setListaArchivos(archivosLista: FileList, fileMapped){
    this._extraerArchivos(archivosLista, fileMapped);
    //console.log('lista archivos ', this.archivos);
  }

  private _extraerArchivos(archivosLista: FileList, fileMapped: string){
    //console.log(archivosLista);

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
    this.addandSetArchivosAlert();
    this.setTypeArchivo(fileMapped);
  }

  setTypeArchivo(fileMapped: string){
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
      case 'FileBaucher':
          this.agregarFileBaucher = true;
          this.nominacionForm.get('fileBaucher').reset();
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

  addandSetArchivosAlert(){
    Swal.fire({
      title: 'Agregar uno o Cargar todos?',
      text: `Agregar uno: Agregará los archivos que selecciones a los ya cargados.
       Cargar todos: Eliminará los archivos ya cargados por los que selecciones.`,
      allowOutsideClick: false,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3c3174',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Agregar Uno!',
      cancelButtonText: 'Cargar Todos!',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Agregar Uno');
        this.addOnlyOneFileMultimedia = true;
      }else{
        console.log('Cargar Todos');
        this.addOnlyOneFileMultimedia = false;
      }
    });
  }

  setFilesMultimedia(){
    let archivos: any[];

    if(this.addOnlyOneFileMultimedia){//Agregará los archivos que selecciones a los ya cargados
        archivos = this.nominacionEditar.materialMultimedia;
        this.filesSave.filter(x => x.fileMapped == 'FileMaterialMultimedia').forEach( (data) => {
          if(!archivos.find(z => z.idFile == data.idDoc)){
            archivos.push({ idFile: data.idDoc, url: data.url });
          }
        });
    }else{//Eliminará los archivos ya cargados por los que selecciones.
        archivos = this.filesSave.filter(x => x.fileMapped == 'FileMaterialMultimedia').map( (data) => { return { idFile: data.idDoc, url: data.url }} );
    }
    return archivos;

  }

  setNominacionUpdate(nominacion: NominacionModel){
    this.nominacionUpdate = nominacion;
    console.log('set nominacion update ', this.nominacionUpdate);
  }

  updateEstatusPagoNominacion(estatus: string){
    Swal.fire({
      title: 'Actualizar Estatus de Pago?',
      text: "Se cambiará el estatus de pago a: "+estatus,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3c3174',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Actualizar!',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.nominacionUpdate.statuspago = estatus;
        this.nominacionEditar.statuspago = this.nominacionUpdate.statuspago;
        console.log('UPDATE ESTATUS PAGO ', this.nominacionUpdate);
        this.nominacionService.updateStatusPagoNominacion(this.nominacionUpdate);
        this.toastr.success('Nominación actualizada con exito!!', 'Success');
      }
    });

  }


}
