import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { AUTO_STYLE } from '@angular/animations';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor(
    private toastr: ToastrService
  ) { }
  usuarios(user){
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(user, {header:['address', 'email', 'displayName', 'firstName', 'lastName', 'phone', 'photoURL', 'rol', 'uid']});

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'usuarios');
    XLSX.writeFile(wb, 'usuarios.xlsx')
    return this.toastr.success('Exportado con exito!!', 'Exito');

  }
categoria(categri){
  
const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(categri, {header:['id', 'nombre']});
let objectMaxLength = []; 
    for (let i = 0; i < categri.length; i++) {
      let value = <any>Object.values(categri[i]);
      for (let j = 0; j < value.length; j++) {
        if (typeof value[j] == "number") {
          objectMaxLength[j] = 10;
        } else {
          objectMaxLength[j] =
            objectMaxLength[j] >= value[j].length
              ? objectMaxLength[j]
              : value[j].length;
        }
      }
    }
    console.log(objectMaxLength);
ws['!cols'] = [
  {
    width: objectMaxLength[1]
  },
  {
    width: objectMaxLength[0]
  }
]
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'categorias');
    XLSX.writeFile(wb, 'categorias.xlsx')
    return this.toastr.success('Exportado con exito!!', 'Exito');
}
  convoc(convoc: any){
    let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(convoc, { header: ['titulo', 'fechaInicio', 'fechaFin'] })
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'convocatorias');
    XLSX.writeFile(wb, 'convocatorias.xlsx')
    return this.toastr.success('Exportado con exito!!', 'Exito');
  }
  nomina(nomin:any){
    let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(nomin)
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'nominaciones');
    XLSX.writeFile(wb, 'nominaciones.xlsx')
    return this.toastr.success('Exportado con exito!!', 'Exito');
  }
}
