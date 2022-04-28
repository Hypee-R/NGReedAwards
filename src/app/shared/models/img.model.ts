export class ImageModel{
  nombre: string;
  url: string;
}

export class FileItem{
  public archivo: File;
  public nombreArchivo: string;
  public url: string | any;
  public subiendo: boolean;
  public progreso: number;

  constructor(archivo: File){
    this.archivo = archivo;
    this.nombreArchivo = archivo.name;
    this.url = '';
    this.subiendo = false;
    this.progreso = 0;
  }
}
