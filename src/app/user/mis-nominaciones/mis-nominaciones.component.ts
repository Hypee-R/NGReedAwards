import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { PaisesService } from '../../services/paises.service';
import { CargaImagenesService } from '../../services/cargaImagenes.service';
import { FileItem } from 'src/app/shared/models/img.model';
import { ToastrService } from 'ngx-toastr';
import { NominacionService } from '../../services/nominacion.service';
import { VariablesService } from '../../services/variablesGL.service';

@Component({
  selector: 'app-mis-nominaciones',
  templateUrl: './mis-nominaciones.component.html',
  styleUrls: ['./mis-nominaciones.component.css']
})
export class MisNominacionesComponent implements OnInit {

  nominacionForm: FormGroup;
  submitted: boolean;
  categorias: any;
  paises: any;
  item$: Observable<any>;
  archivos: FileItem[] = [];
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
  }

  getCategorias(){
    const categoriasCollection = collection(this.firestore, 'categorias');
    collectionData(categoriasCollection).subscribe( (data) => {
      this.categorias = data;
      console.log('data categorias ', this.categorias);
    });
  }

  getPaises(){
      this.paisesService.getPaises().subscribe( (data: any) => {
          if(data.length > 0){
            this.paises = data.sort((a, b) => a.name.common - b.name.common);
            console.log('data content paises ordenados', this.paises);
          }
      });
  }

  initForm(){
    this.nominacionForm = this.fb.group({
      titulo: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      nominado: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      //fileLogoEmpresa: ['', []],
      organizacion: ['', [Validators.required]],
      responsable: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      rsInstagram: ['' ],
      rsTwitter: ['' ],
      rsFacebook: ['' ],
      rsYoutube: ['' ],
      //fileCesionDerechos: ['', []],
      //fileCartaIntencion: ['', []],
    })
  }

  async crearNominacion(){
    this.submitted = true;
    console.log('form data nominacion ', this.nominacionForm);
    if(this.nominacionForm.valid){
      this.cargaImagenesFBService.upload(this.archivos);

      this.variablesGL.endProcess.subscribe(endProcessUpload => {

        if(endProcessUpload){
          let imgSave = this.cargaImagenesFBService.idsImageSave;
          let imgError = this.cargaImagenesFBService.idsImageErr;
          if(imgError.length && imgError.length > 0){
            imgError.forEach(imgErr => {
              this.toastr.error('Hubo un error al cargar este archivo! :('+imgErr.img.nombre, 'Error');
            });
            this.archivos = [];
          }else{
            this.toastr.success('Archivos cargados con exito!!', 'Success');
            this.nominacionService.addNominacion({
              titulo: this.nominacionForm.get('titulo').value,
              categoria: this.nominacionForm.get('categoria').value,
              nominado: this.nominacionForm.get('nominado').value,
              descripcion: this.nominacionForm.get('descripcion').value,
              idFileLogo: imgSave.find(x => x.fileMapped == 'FileLogoEmpresa').idDoc,
              organizacion: this.nominacionForm.get('organizacion').value,
              responsable: this.nominacionForm.get('responsable').value,
              telefono: this.nominacionForm.get('telefono').value,
              pais: this.nominacionForm.get('pais').value,
              rsInstagram: this.nominacionForm.get('rsInstagram').value,
              rsTwitter: this.nominacionForm.get('rsTwitter').value,
              rsFacebook: this.nominacionForm.get('rsFacebook').value,
              rsYoutube: this.nominacionForm.get('rsYoutube').value,
              idFileCesionDerechos: imgSave.find(x => x.fileMapped == 'FileCesionDerechos').idDoc,
              idFileCartaIntencion: imgSave.find(x => x.fileMapped == 'FileCartaIntencion').idDoc,
              materialMultimedia: imgSave.filter(x => x.fileMapped == 'FileMaterialMultimedia').map(data => data.idDoc),
              uid: JSON.parse(localStorage.d).uid
            });

            this.variablesGL.endProcessNominacion.subscribe(endProcessNominacion => {
              if(endProcessNominacion != ''){
                this.toastr.success('Nominación creada con exito!!', 'Success');
                this.submitted = false;
                this.nominacionForm.reset();
                this.archivos = [];
              }else if(endProcessNominacion == ''){
                this.toastr.error('Hubo un error al guardar la nominacion! :(', 'Error');
                this.submitted = false;
              }
            });
          }
        }
      });
    }
  }

  onFileSelected(event: any, fileMapped: string){
    if(event){
        const archivosLista: FileList = event.target.files;
        this._extraerArchivos(archivosLista, fileMapped);
        console.log('lista archivos ', this.archivos);
      }
  }

  private _extraerArchivos(archivosLista: FileList, fileMapped: string){
    console.log(archivosLista);

    for (const propiedad in Object.getOwnPropertyNames( archivosLista )) {
      const archivoTemp = archivosLista[propiedad];

      //if(this._archivoPuedeSerCargado(archivoTemp)){

        const newArchivo = new FileItem(archivoTemp);
        newArchivo.fileMapped = fileMapped;
        this.archivos.push(newArchivo);

      //}
    }
}

}
