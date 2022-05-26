import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  convoc(convoc: any){
    let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(convoc, { header: ['titulo', 'fechaInicio', 'fechaFin'] })
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'convocatorias');
    XLSX.writeFile(wb, 'convocatorias.xlsx')
  }
  nomina(nomin:any){
    let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(nomin)
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'nominaciones');
    XLSX.writeFile(wb, 'nominaciones.xlsx')
  }
}
