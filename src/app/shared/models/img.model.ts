export class ImageModel{
  nombre: string;
  url: string;
  uid: string;
  fileMapped: string;
}

export class FileItem{
  public archivo: File;
  public nombreArchivo: string;
  public url: string | any;
  public subiendo: boolean;
  public progreso: number;
  public fileMapped: string;

  constructor(archivo: File){
    this.archivo = archivo;
    this.nombreArchivo = archivo.name;
    this.url = '';
    this.subiendo = false;
    this.progreso = 0;
    this.fileMapped = '';
  }
}
