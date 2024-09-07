import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Toast } from '../shared/models/toast.model';
import { SwalModel } from 'src/app/shared/models/swal.model';
import { FormGroup } from '@angular/forms';
import { CategoriaModel } from '../models/categoria.model';
import { ReservacionModel } from '../models/reservacion.model';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class VariablesService {
  showSideUser = new Subject<boolean>();
  showSideBar = new Subject<boolean>();
  changeTipoMenu = new Subject<boolean>();

  toastLogin = new BehaviorSubject<Toast>(null);
  toast = new BehaviorSubject<Toast>(null);
  swal = new BehaviorSubject<SwalModel>(null);
  pagina = new BehaviorSubject<string>('');
  endProcessCargaCompleta = new BehaviorSubject<boolean>(false);
  endProcessNominacion = new BehaviorSubject<string>(null);
  endProcessContacto = new BehaviorSubject<string>(null);
  preloadCategoria = new BehaviorSubject<CategoriaModel>(null);
  endProcessreservacion = new BehaviorSubject<string>(null);
  statusTemplateRservacionPDF = new BehaviorSubject<boolean>(null);

  constructor(private router: Router) {}

  getStatusPantalla(): number {
    let width = window.screen.width;

    if (width < 640) return 1;
    else if (width > 640 && width < 769) return 10;
    else return 17;
  }

  removeCredential() {
    localStorage.d = '';
    localStorage.setItem('urlanterior', '');
    localStorage.clear();
    location.reload();
    this.router.navigate(['/'], { replaceUrl: true });
  }

  removeCredentialAdmin() {
    localStorage.d = '';
    localStorage.clear();
    localStorage.setItem('urlanterior', '');
    location.reload();
    this.router.navigate(['/portal/login'], { replaceUrl: true });
  }

  removeCredentialAdminEvento() {
    localStorage.d = '';
    localStorage.setItem('urlanterior', '');
    localStorage.clear();
    location.reload();
    this.router.navigate(['/reedeventoadmin/login'], { replaceUrl: true });
  }

  getDataTable(data: any): any {
    let arregloCols: any[] = [];
    let headers = Object.keys(data[0]);

    headers.map((h) => {
      if (h.substring(0, 2).toLowerCase() != 'id') {
        arregloCols.push({
          field: h,
          header: h,
        });
      }
    });

    let arregloRows: any[] = [];
    data.map((row) => {
      let x: any = [];
      headers.map((h) => {
        x[h] = row[h];
      });
      arregloRows.push(x);
    });

    return { cols: arregloCols, rows: arregloRows };
  }

  checkPassword(group: FormGroup): any {
    const pass = group.controls.password?.value;
    const confirmPassword = group.controls.repetirPassword?.value;
    return pass === confirmPassword ? null : { notSame: true };
  }

  getWidthDocument() {
    let width = window.screen.width;
    let widthDocument =
      Math.trunc((width * 460) / 1366) + (width < 1920 ? 7 : 14);
    // width = 1920 -> 660
    // width = 1366 -> 460
    if (width == 1366) {
      widthDocument = 460;
    } else if (width == 1920) {
      widthDocument = 660;
    }
    console.log('width pantalla: ' + width + ' --> ', widthDocument);
    return widthDocument;
  }

  generateReservacionPDF(lugar: ReservacionModel, templateElement: any): void {
    let widthDocument = this.getWidthDocument();

    Swal.fire({
      title: 'Por favor espera...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      html2canvas(templateElement.nativeElement, { scale: 3 }).then(
        (canvas) => {
          const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
          const fileWidth = widthDocument;
          const generatedImageHeight =
            (canvas.height * fileWidth) / canvas.width;
          let PDF = new jsPDF('p', 'mm', 'a4');
          PDF.addImage(
            imageGeneratedFromTemplate,
            'PNG',
            0,
            5,
            fileWidth,
            generatedImageHeight
          );
          PDF.html(templateElement.nativeElement.innerHTML);
          PDF.text(lugar.codigotiket.toString(), 7, 68); //Folio
          PDF.text(lugar.Nombrecomprador.toString(), 7, 86); //Comprador
          PDF.text(lugar.montopago.toString(), 110, 86); //Costo
          PDF.text(lugar.codigotiket.toString(), 7, 269); //Folio
          PDF.text(lugar.Nombrecomprador.toString(), 7, 288); //Comprador
          PDF.text(lugar.montopago.toString(), 110, 288); //Costo
          PDF.link(55, 231, 44, 7, { url: 'https://bit.ly/3KsUcLv' }); //url left
          PDF.link(160, 231, 44, 7, { url: 'https://bit.ly/3PKjSUy' }); //url rigth
          // PDF.textWithLink('https://bit.ly/3KsUcLv', 55, 230,{ url: 'https://bit.ly/3KsUcLv' });
          // PDF.textWithLink('https://bit.ly/3PKjSUy', 160, 230,{ url: 'https://bit.ly/3PKjSUy' });
          PDF.save('reed-latino-reservacion.pdf');
          setTimeout(() => {
            Swal.close();
            this.statusTemplateRservacionPDF.next(false);
            Swal.fire({
              icon: 'success',
              title: 'PDF Generado Correctamente!',
              showConfirmButton: false,
              timer: 2000,
            });
          }, 400);
        }
      );
    }, 600);
  }

  mensajeCorreo(nominacion: any): string {
    var mensaje = `<html lang="es">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Notificación de Sistema</title>
      
  </head>
  <body>
      <td style="direction:ltr;font-size:0px;padding:16px;text-align:center">
<div style="margin:0px auto;max-width:700px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%">
<tbody>
<tr>
<td style="border-left:0;border-right:0;border-top:0;direction:ltr;font-size:0px;padding:0;text-align:center">
<div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="vertical-align:top">
<tbody>
<tr>
<td style="background:#ffffff;font-size:0px;word-break:break-word">
<div style="height:0px;line-height:0px">&hairsp;</div>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:700px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
<tbody>
<tr>
<td style="border-left:0;border-right:0;direction:ltr;font-size:0px;padding:20px 20px 0px 20px;text-align:center">
<div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td style="background-color:transparent;vertical-align:top;padding:1px 0px 13px 0px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td>
<div style="text-align:center"><a href="https://ceonline.com.mx/so/66P6uynMM/c?w=bqrGkn8iFj7n9409UCipMPvkBoSwX3tftKO4iHRqkmg.eyJ1IjoiaHR0cHM6Ly9yZWVkbGF0aW5vLmNvbS8iLCJyIjoiYzgyY2E5OWQtMDU3OS00OTBlLTg4NGItZWFlMDE5ZTZhMWIyIiwibSI6Im1haWwiLCJjIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIn0" style="display:inline-block;max-width:100%;max-height:122px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://ceonline.com.mx/so/66P6uynMM/c?w%3DbqrGkn8iFj7n9409UCipMPvkBoSwX3tftKO4iHRqkmg.eyJ1IjoiaHR0cHM6Ly9yZWVkbGF0aW5vLmNvbS8iLCJyIjoiYzgyY2E5OWQtMDU3OS00OTBlLTg4NGItZWFlMDE5ZTZhMWIyIiwibSI6Im1haWwiLCJjIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIn0&amp;source=gmail&amp;ust=1725661402535000&amp;usg=AOvVaw0RxbcZzcIhN6UDof8FNE45"><img src="https://ci3.googleusercontent.com/meips/ADKq_NbYnn318KaKZpycXRr0i2idTKOfjN4REjMj100Y7CTFUfEvJo6dk_5JT6dyJJja2FNx_IMeC4v0AKsPuoBQhR1V0ToOCza02WVY5KHbaUxncei7HuiRwKGTadFAlcw0vUiA1PrP6hnjI8rb2usXzYpLayZ_BHL7aoiPgvZmsEyZft4As32kafYm2B5-BdahVCBRrDDLz_37g300MH2wTDOKFWvJuzbDc-tW2kkZYr-xfClVZcbb1UtpM1_h=s0-d-e1-ft#https://images.wixstatic.com/media/194053_42013abae2d640e0bfb5f719fea03dc7~mv2.png/v1/fit/h_244,q_100,w_660,al_c,lg_0/194053_42013abae2d640e0bfb5f719fea03dc7~mv2.png" width="auto" alt="" style="display:inline-block;max-width:100%;width:auto;vertical-align:middle;max-height:122px" class="CToWUd" data-bit="iit"></a></div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:700px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
<tbody>
<tr>
<td style="border-left:0;border-right:0;direction:ltr;font-size:0px;padding:0px 20px 0px 20px;text-align:center">
<div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td style="vertical-align:top;padding:20px 0px 20px 0px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td align="center" style="font-size:0px;padding:0px;word-break:break-word">
<div style="font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:13px;line-height:1;text-align:center;color:#000000;white-space:pre-wrap">
<a style="display:inline-block;max-width:100%"><img src="https://ci3.googleusercontent.com/meips/ADKq_NZPpVT7iauMIPo7obxYfiZnQNLk0-46vuNCmAalP--Ii08hyerBWflWjNGAqLBP3i2UwduTTAsUuFINuK_Z6bjMPzX7mYwjM1LmLPk7CMG4UmT_p-zk6oGX3WHyxKWQzB1s8oScTe6WMcfI6Gf2AZ3J7e550Qq8QCiNeUuuCJZjCYqPKn3Z79W8U75xp_7e525-DJ1CCC0PfFtRxgW6eOtWnRxDBtz6_NJm7_vhII8f5-5oDIYVdmQ=s0-d-e1-ft#https://static.wixstatic.com/media/194053_ddfe508d8cea420991038eff15ca7d19~mv2.png/v1/fit/w_1228,h_2000,al_c,q_85/194053_ddfe508d8cea420991038eff15ca7d19~mv2.png" width="auto" alt="" style="display:inline-block;max-width:100%;vertical-align:middle;width:auto" class="CToWUd a6T" data-bit="iit" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 391px; top: 602.5px;"><span data-is-tooltip-wrapper="true" class="a5q" jsaction="JIbuQc:.CLIENT"><button class="VYBDae-JX-I VYBDae-JX-I-ql-ay5-ays CgzRE" jscontroller="PIVayb" jsaction="click:h5M12e; clickmod:h5M12e;pointerdown:FEiYhc;pointerup:mF5Elf;pointerenter:EX0mI;pointerleave:vpvbp;pointercancel:xyn4sd;contextmenu:xexox;focus:h06R8; blur:zjh6rb;mlnRJb:fLiPzd;" data-idom-class="CgzRE" jsname="hRZeKc" aria-label="Descargar el archivo adjunto " data-tooltip-enabled="true" data-tooltip-id="tt-c133" data-tooltip-classes="AZPksf" id="" jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTgwOTM5Mzg0MjY1ODczNzAxOCJd; 43:WyJpbWFnZS9qcGVnIl0."><span class="OiePBf-zPjgPe VYBDae-JX-UHGRz"></span><span class="bHC-Q" data-unbounded="false" jscontroller="LBaJxb" jsname="m9ZlFb" soy-skip="" ssk="6:RWVI5c"></span><span class="VYBDae-JX-ank-Rtc0Jf" jsname="S5tZuc" aria-hidden="true"><span class="bzc-ank" aria-hidden="true"><svg viewBox="0 -960 960 960" height="20" width="20" focusable="false" class=" aoH"><path d="M480-336L288-528l51-51L444-474V-816h72v342L621-579l51,51L480-336ZM263.72-192Q234-192 213-213.15T192-264v-72h72v72H696v-72h72v72q0,29.7-21.16,50.85T695.96-192H263.72Z"></path></svg></span></span><div class="VYBDae-JX-ano"></div></button><div class="ne2Ple-oshW8e-J9" id="tt-c133" role="tooltip" aria-hidden="true">Descargar</div></span></div></a></div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div style="text-transform:none;text-align:center;font-family:helvetica,sans-serif;line-height:1.1;font-size:40px;font-weight:bold;background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:700px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
<tbody>
<tr>
<td style="border-left:0;border-right:0;direction:ltr;font-size:0px;padding:0px 20px 0px 20px;text-align:center">
<div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td style="background-color:transparent;border:0px none transparent;border-radius:0px;vertical-align:top;padding:40px 40px 20px 40px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td align="left" style="font-size:0px;padding:0px;word-break:break-word">
<div style="font-family:helvetica,sans-serif;font-size:40px;font-style:normal;line-height:1;text-align:left;text-transform:none;color:#000000;white-space:pre-wrap">
<div style="text-align:center">
<p style="margin:0;font-size:24px;line-height:26px"><span style="color:#000000">Hola ${nominacion.nominado}</span></p>
<p style="margin:0;font-size:24px;line-height:26px"><span>&nbsp;</span></p>
<p style="margin:0;font-size:24px;line-height:26px"><span style="color:#000000">Te comunicamos que tu trabajo fue nominado al Reed Latino 2024</span></p>
<p style="margin:0;text-align:left;font-size:24px;line-height:26px"><span>&nbsp;</span></p>
<p style="margin:0;text-align:left;font-size:24px;line-height:26px"><span>&nbsp;</span></p>
<p style="margin:0;font-size:24px;line-height:52px"><span style="font-size:48px">MUCHAS FELICIDADES</span></p>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:700px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
<tbody>
<tr>
<td style="border-left:0;border-right:0;direction:ltr;font-size:0px;padding:0px 20px 0px 20px;text-align:center">
<div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td style="vertical-align:top;padding:20px 0px 20px 0px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td align="center" style="font-size:0px;padding:0px;word-break:break-word">
<div style="font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:13px;line-height:1;text-align:center;color:#000000;white-space:pre-wrap">
<a style="display:inline-block;max-width:100%"><img src="https://ci3.googleusercontent.com/meips/ADKq_NZjG3QJEVg-2W9bCeSCdJaJ_5xLjNYT_NjbiSLOw9bLVNsyu_O-REbLhd3DLDEy8gqGIwSRqBC635f-5VY1qebJMimAYJdGFtiJF1BogA9FvAYd3rNpo6Q3e0TA2AePloUw00ROFOrooDzEMCwTi0SkJ-lfrfT9Kye0GlO_I16Ynd0nknHboErARelbWooV2abMRmm-4o08tbhPanKXdrILZ_joXkhs9QdTapx6v1wqYrLfYNcJ04U=s0-d-e1-ft#https://static.wixstatic.com/media/194053_4b852941ff4f434382270474568c69be~mv2.png/v1/fit/w_1320,h_2000,al_c,q_85/194053_4b852941ff4f434382270474568c69be~mv2.png" width="auto" alt="" style="display:inline-block;max-width:100%;vertical-align:middle;width:auto" class="CToWUd a6T" data-bit="iit" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 391px; top: 1564.05px;"><span data-is-tooltip-wrapper="true" class="a5q" jsaction="JIbuQc:.CLIENT"><button class="VYBDae-JX-I VYBDae-JX-I-ql-ay5-ays CgzRE" jscontroller="PIVayb" jsaction="click:h5M12e; clickmod:h5M12e;pointerdown:FEiYhc;pointerup:mF5Elf;pointerenter:EX0mI;pointerleave:vpvbp;pointercancel:xyn4sd;contextmenu:xexox;focus:h06R8; blur:zjh6rb;mlnRJb:fLiPzd;" data-idom-class="CgzRE" jsname="hRZeKc" aria-label="Descargar el archivo adjunto " data-tooltip-enabled="true" data-tooltip-id="tt-c134" data-tooltip-classes="AZPksf" id="" jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTgwOTM5Mzg0MjY1ODczNzAxOCJd; 43:WyJpbWFnZS9qcGVnIl0."><span class="OiePBf-zPjgPe VYBDae-JX-UHGRz"></span><span class="bHC-Q" data-unbounded="false" jscontroller="LBaJxb" jsname="m9ZlFb" soy-skip="" ssk="6:RWVI5c"></span><span class="VYBDae-JX-ank-Rtc0Jf" jsname="S5tZuc" aria-hidden="true"><span class="bzc-ank" aria-hidden="true"><svg viewBox="0 -960 960 960" height="20" width="20" focusable="false" class=" aoH"><path d="M480-336L288-528l51-51L444-474V-816h72v342L621-579l51,51L480-336ZM263.72-192Q234-192 213-213.15T192-264v-72h72v72H696v-72h72v72q0,29.7-21.16,50.85T695.96-192H263.72Z"></path></svg></span></span><div class="VYBDae-JX-ano"></div></button><div class="ne2Ple-oshW8e-J9" id="tt-c134" role="tooltip" aria-hidden="true">Descargar</div></span></div></a></div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:700px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
<tbody>
<tr>
<td style="border-left:0;border-right:0;direction:ltr;font-size:0px;padding:0px 20px 0px 20px;text-align:center">
<div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td style="vertical-align:top;padding:20px 40px 20px 40px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td align="center" valign="middle" style="font-size:0px;padding:0;word-break:break-word">
<div style="max-width:400px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%">
<tbody>
<tr>
<td align="center" bgcolor="#000000" role="presentation" valign="middle" style="border:solid 0px transparent;border-radius:0px;background:#000000">
<a href="https://reedlatino.com/" rel="noopener" style="display:inline-block;background:#000000;color:#ffffff;font-family:helvetica,sans-serif;font-size:16px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:12px 40px 12px 40px;border-radius:0px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://reedlatino.com/&amp;source=gmail&amp;ust=1725661402535000&amp;usg=AOvVaw2Mn_Kk3qioHZHVTO6IKWMi"><strong style="font-weight:inherit">Consulta
 todos los nominados aquí</strong></a><img height="1" src="https://ci3.googleusercontent.com/meips/ADKq_NbboQ5kKZyuJcu9Cjw74YMrli5ymYfELB-qqmtTKc8EQ1-AIyhNMszn1MB9Z9lTK2CIGOyLmozphVgYFqnXK365iBLqEFZt2v7nhT9vYBxThMEt_G5KM4uCPAQ8xJBhFE0Src3n5cl3=s0-d-e1-ft#https://static.wixstatic.com/media/5e9922_0a9111966d7648649336e1f1546c5ec9~mv2.gif" alt="" style="display:block;width:100px!important;height:1px;max-width:100%!important;max-height:1px" class="CToWUd" data-bit="iit"></td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:700px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
<tbody>
<tr>
<td style="border-left:0;border-right:0;direction:ltr;font-size:0px;padding:0px 20px 0px 20px;text-align:center">
<div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td style="vertical-align:top;padding:0px 0px 0px 0px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td align="center" style="font-size:0px;padding:0px;word-break:break-word">
<table cellpadding="0" cellspacing="0" width="62" border="0" style="color:#000000;font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:62px;border:none">
<tbody>
<tr>
<td>
<div style="line-height:40px">
<div style="display:inline-block;width:100%;border-bottom:2px solid #000000;vertical-align:middle">
</div>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div style="color:#000000;font-family:helvetica,sans-serif;line-height:1.6;font-size:18px;background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:700px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
<tbody>
<tr>
<td style="border-left:0;border-right:0;direction:ltr;font-size:0px;padding:0px 20px 0px 20px;text-align:center">
<div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td style="background-color:transparent;border:0px none transparent;border-radius:0px;vertical-align:top;padding:20px 40px 20px 40px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td align="left" style="font-size:0px;padding:0px;word-break:break-word">
<div style="font-family:helvetica,sans-serif;font-size:18px;font-style:normal;line-height:1;text-align:left;text-transform:none;color:#000000;white-space:pre-wrap">
<div style="text-align:center">
<p style="margin:0;font-size:24px;line-height:38px"><span style="font-weight:bold">ESOS SON LOS EVENTOS DE PREMIACIÓN</span></p>
<p style="margin:0;font-size:24px;line-height:38px"><span><span style="font-weight:bold;line-height:38px;font-size:24px"><span style="font-style:normal">#SaveTheDate</span>&nbsp;</span></span></p>
<p style="margin:0;font-size:24px;line-height:38px"><span>&nbsp;</span></p>
<ul style="list-style-position:inside;font-size:24px;line-height:38px;padding:0;margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-left:24px;padding-right:0px">
<li style="text-align:left">
<p style="margin:0;display:inline;font-size:24px;line-height:38px"><span style="font-weight:bold;font-style:normal">25 de octubre coctel de nominados</span></p>
</li><li style="text-align:left">
<p style="margin:0;display:inline;font-size:24px;line-height:38px"><span style="font-weight:bold;font-style:normal">26 de octubre Ceremonia de premiación</span></p>
<p style="margin:0;font-size:24px;line-height:38px"><span>&nbsp;</span></p>
</li></ul>
<p style="margin:0;font-size:24px;line-height:38px"><span style="font-weight:bold;font-style:normal">CARTAGENA DE INDIAS, COLOMBIA</span></p>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:700px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
<tbody>
<tr>
<td style="border-left:0;border-right:0;direction:ltr;font-size:0px;padding:0px 20px 0px 20px;text-align:center">
<div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td style="vertical-align:top;padding:20px 40px 20px 40px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td align="center" valign="middle" style="font-size:0px;padding:0;word-break:break-word">
<div style="max-width:400px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%">
<tbody>
<tr>
<td align="center" bgcolor="#9B2AF8" role="presentation" valign="middle" style="border:solid 0px transparent;border-radius:0px;background:#9b2af8">
<a href="https://reservas.reedlatino.com/reedevento/home?_gl=1*1j8p9f*_ga*MTU3NTk0OTAwNy4xNzE4NDkxNzAx*_ga_558MZ2X23Z*MTcyNTU2NjU2OC40OC4xLjE3MjU1NjgzNTAuMC4wLjA." rel="noopener" style="display:inline-block;background:#9b2af8;color:#ffffff;font-family:helvetica,sans-serif;font-size:16px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:12px 40px 12px 40px;border-radius:0px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://reservas.reedlatino.com/reedevento/home?_gl%3D1*1j8p9f*_ga*MTU3NTk0OTAwNy4xNzE4NDkxNzAx*_ga_558MZ2X23Z*MTcyNTU2NjU2OC40OC4xLjE3MjU1NjgzNTAuMC4wLjA.&amp;source=gmail&amp;ust=1725661402535000&amp;usg=AOvVaw3vkszdd_8irSlLyZtJaZ_o"><strong style="font-weight:inherit">RESERVA
 TU LUGAR AQUÍ</strong></a><img height="1" src="https://ci3.googleusercontent.com/meips/ADKq_NbboQ5kKZyuJcu9Cjw74YMrli5ymYfELB-qqmtTKc8EQ1-AIyhNMszn1MB9Z9lTK2CIGOyLmozphVgYFqnXK365iBLqEFZt2v7nhT9vYBxThMEt_G5KM4uCPAQ8xJBhFE0Src3n5cl3=s0-d-e1-ft#https://static.wixstatic.com/media/5e9922_0a9111966d7648649336e1f1546c5ec9~mv2.gif" alt="" style="display:block;width:100px!important;height:1px;max-width:100%!important;max-height:1px" class="CToWUd" data-bit="iit"></td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:700px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
<tbody>
<tr>
<td style="border-left:0;border-right:0;direction:ltr;font-size:0px;padding:0px 20px 0px 20px;text-align:center">
<div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td style="vertical-align:top;padding:20px 0px 20px 0px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td align="center" style="font-size:0px;padding:0px;word-break:break-word">
<div style="font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:13px;line-height:1;text-align:center;color:#000000;white-space:pre-wrap">
<a style="display:inline-block;max-width:100%"><img src="https://ci3.googleusercontent.com/meips/ADKq_NZB5cliCbSq6fIdeiLYJEAk3F6wGxWWh7AEtMM_6dJHkiD6aCUTd_FC3YSi3gYsU6ZSoIZSrw_Ce2KYUWdf6b8oxe04HdGocNKp5RBysECZL79ZWQ4bNHGn94HxoYekoSIozj1ymeadxDofqwOPzsz2U8CA_aMpQo1mOW0z1sAhHGtVn3sF0-wl73uhTMA6K_q0uIo88czoh9Y0jWBnqQAvId3k-fhpQ-lY0WfcUOPicW9lcI2BRGo=s0-d-e1-ft#https://static.wixstatic.com/media/194053_5ea2c5f7181047708ad53a38ee97c25a~mv2.png/v1/fit/w_1320,h_2000,al_c,q_85/194053_5ea2c5f7181047708ad53a38ee97c25a~mv2.png" width="auto" alt="" style="display:inline-block;max-width:100%;vertical-align:middle;width:auto" class="CToWUd a6T" data-bit="iit" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 391px; top: 3033.72px;"><span data-is-tooltip-wrapper="true" class="a5q" jsaction="JIbuQc:.CLIENT"><button class="VYBDae-JX-I VYBDae-JX-I-ql-ay5-ays CgzRE" jscontroller="PIVayb" jsaction="click:h5M12e; clickmod:h5M12e;pointerdown:FEiYhc;pointerup:mF5Elf;pointerenter:EX0mI;pointerleave:vpvbp;pointercancel:xyn4sd;contextmenu:xexox;focus:h06R8; blur:zjh6rb;mlnRJb:fLiPzd;" data-idom-class="CgzRE" jsname="hRZeKc" aria-label="Descargar el archivo adjunto " data-tooltip-enabled="true" data-tooltip-id="tt-c135" data-tooltip-classes="AZPksf" id="" jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTgwOTM5Mzg0MjY1ODczNzAxOCJd; 43:WyJpbWFnZS9qcGVnIl0."><span class="OiePBf-zPjgPe VYBDae-JX-UHGRz"></span><span class="bHC-Q" data-unbounded="false" jscontroller="LBaJxb" jsname="m9ZlFb" soy-skip="" ssk="6:RWVI5c"></span><span class="VYBDae-JX-ank-Rtc0Jf" jsname="S5tZuc" aria-hidden="true"><span class="bzc-ank" aria-hidden="true"><svg viewBox="0 -960 960 960" height="20" width="20" focusable="false" class=" aoH"><path d="M480-336L288-528l51-51L444-474V-816h72v342L621-579l51,51L480-336ZM263.72-192Q234-192 213-213.15T192-264v-72h72v72H696v-72h72v72q0,29.7-21.16,50.85T695.96-192H263.72Z"></path></svg></span></span><div class="VYBDae-JX-ano"></div></button><div class="ne2Ple-oshW8e-J9" id="tt-c135" role="tooltip" aria-hidden="true">Descargar</div></span></div></a></div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:700px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
<tbody>
<tr>
<td style="border-left:0;border-right:0;direction:ltr;font-size:0px;padding:0px 20px 0px 20px;text-align:center">
<div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td style="vertical-align:top;padding:20px 0px 20px 0px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td align="center" style="font-size:0px;padding:0px;word-break:break-word">
<div style="font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:13px;line-height:1;text-align:center;color:#000000;white-space:pre-wrap">
<a style="display:inline-block;max-width:100%"><img src="https://ci3.googleusercontent.com/meips/ADKq_NaFbFJambWOdhuqzIXEXnIGdaRiCGsa9ulE7Ru8GdpSbKWvNAKi-R_5Q1khXIQjeL2Rgbtppgsy6Tdis_97lbHVY2_uRWT5BKo6GlfyE_BcF1hKu3Spkd_MRMmcDJK2CqXqrTz3Ye2jcHXCXacjYDXSaihgtTeU8gHWFXDSBSgpANtWpqza5xvrAdtC5a3bGUNZHc3rxFTyxL_8-PUnGtyjPVg3MaRlzhvp2KefeiFP-MK1ftlN63A=s0-d-e1-ft#https://static.wixstatic.com/media/194053_5fdcf20e95524db3a19c0c7a90b2139c~mv2.jpg/v1/fit/w_1200,h_2000,al_c,q_85/194053_5fdcf20e95524db3a19c0c7a90b2139c~mv2.jpg" width="auto" alt="" style="display:inline-block;max-width:100%;vertical-align:middle;width:auto" class="CToWUd a6T" data-bit="iit" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 391px; top: 3481.83px;"><span data-is-tooltip-wrapper="true" class="a5q" jsaction="JIbuQc:.CLIENT"><button class="VYBDae-JX-I VYBDae-JX-I-ql-ay5-ays CgzRE" jscontroller="PIVayb" jsaction="click:h5M12e; clickmod:h5M12e;pointerdown:FEiYhc;pointerup:mF5Elf;pointerenter:EX0mI;pointerleave:vpvbp;pointercancel:xyn4sd;contextmenu:xexox;focus:h06R8; blur:zjh6rb;mlnRJb:fLiPzd;" data-idom-class="CgzRE" jsname="hRZeKc" aria-label="Descargar el archivo adjunto " data-tooltip-enabled="true" data-tooltip-id="tt-c136" data-tooltip-classes="AZPksf" id="" jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTgwOTM5Mzg0MjY1ODczNzAxOCJd; 43:WyJpbWFnZS9qcGVnIl0."><span class="OiePBf-zPjgPe VYBDae-JX-UHGRz"></span><span class="bHC-Q" data-unbounded="false" jscontroller="LBaJxb" jsname="m9ZlFb" soy-skip="" ssk="6:RWVI5c"></span><span class="VYBDae-JX-ank-Rtc0Jf" jsname="S5tZuc" aria-hidden="true"><span class="bzc-ank" aria-hidden="true"><svg viewBox="0 -960 960 960" height="20" width="20" focusable="false" class=" aoH"><path d="M480-336L288-528l51-51L444-474V-816h72v342L621-579l51,51L480-336ZM263.72-192Q234-192 213-213.15T192-264v-72h72v72H696v-72h72v72q0,29.7-21.16,50.85T695.96-192H263.72Z"></path></svg></span></span><div class="VYBDae-JX-ano"></div></button><div class="ne2Ple-oshW8e-J9" id="tt-c136" role="tooltip" aria-hidden="true">Descargar</div></span></div></a></div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:700px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
<tbody>
<tr>
<td style="border-left:0;border-right:0;direction:ltr;font-size:0px;padding:0px 20px 0px 20px;text-align:center">
<div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td style="vertical-align:top;padding:20px 40px 20px 40px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td align="center" valign="middle" style="font-size:0px;padding:0;word-break:break-word">
<div style="max-width:400px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%">
<tbody>
<tr>
<td align="center" bgcolor="#9B2AF8" role="presentation" valign="middle" style="border:solid 0px transparent;border-radius:0px;background:#9b2af8">
<a href="https://reservas.reedlatino.com/reedevento/home?_gl=1*1j8p9f*_ga*MTU3NTk0OTAwNy4xNzE4NDkxNzAx*_ga_558MZ2X23Z*MTcyNTU2NjU2OC40OC4xLjE3MjU1NjgzNTAuMC4wLjA." rel="noopener" style="display:inline-block;background:#9b2af8;color:#ffffff;font-family:helvetica,sans-serif;font-size:16px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:12px 40px 12px 40px;border-radius:0px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://reservas.reedlatino.com/reedevento/home?_gl%3D1*1j8p9f*_ga*MTU3NTk0OTAwNy4xNzE4NDkxNzAx*_ga_558MZ2X23Z*MTcyNTU2NjU2OC40OC4xLjE3MjU1NjgzNTAuMC4wLjA.&amp;source=gmail&amp;ust=1725661402535000&amp;usg=AOvVaw3vkszdd_8irSlLyZtJaZ_o"><strong style="font-weight:inherit">RESERVA
 TU LUGAR AQUÍ</strong></a><img height="1" src="https://ci3.googleusercontent.com/meips/ADKq_NbboQ5kKZyuJcu9Cjw74YMrli5ymYfELB-qqmtTKc8EQ1-AIyhNMszn1MB9Z9lTK2CIGOyLmozphVgYFqnXK365iBLqEFZt2v7nhT9vYBxThMEt_G5KM4uCPAQ8xJBhFE0Src3n5cl3=s0-d-e1-ft#https://static.wixstatic.com/media/5e9922_0a9111966d7648649336e1f1546c5ec9~mv2.gif" alt="" style="display:block;width:100px!important;height:1px;max-width:100%!important;max-height:1px" class="CToWUd" data-bit="iit"></td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:700px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
<tbody>
<tr>
<td style="border-left:0;border-right:0;direction:ltr;font-size:0px;padding:0px 20px 0px 20px;text-align:center">
<div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td style="vertical-align:top;padding:0px 0px 0px 0px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td align="center" style="font-size:0px;padding:0px;word-break:break-word">
<table cellpadding="0" cellspacing="0" width="62" border="0" style="color:#000000;font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:62px;border:none">
<tbody>
<tr>
<td>
<div style="line-height:40px">
<div style="display:inline-block;width:100%;border-bottom:2px solid #000000;vertical-align:middle">
</div>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div style="text-transform:none;text-align:center;font-family:helvetica,sans-serif;line-height:1.1;font-size:40px;font-weight:bold;background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:700px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
<tbody>
<tr>
<td style="border-left:0;border-right:0;direction:ltr;font-size:0px;padding:0px 20px 0px 20px;text-align:center">
<div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td style="background-color:transparent;border:0px none transparent;border-radius:0px;vertical-align:top;padding:40px 40px 20px 40px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td align="left" style="font-size:0px;padding:0px;word-break:break-word">
<div style="font-family:helvetica,sans-serif;font-size:40px;font-style:normal;line-height:1;text-align:left;text-transform:none;color:#000000;white-space:pre-wrap">
<div style="text-align:center">
<p style="margin:0;font-size:24px;line-height:39px"><span style="font-size:36px;font-weight:bold;font-style:normal">HOTELES SEDE</span></p>
<p style="margin:0;font-size:24px;line-height:26px"><span>&nbsp;</span></p>
<p style="margin:0;font-size:24px;line-height:33px"><span style="font-size:30px">¡Integramos dos nuevos hoteles cercanos al venue donde serán las fiestas 2024!</span></p>
<p style="margin:0;font-size:24px;line-height:26px"><span>&nbsp;</span></p>
<p style="margin:0;font-size:24px;line-height:26px"><span>Reserva YA tu habitación con tarifa especial</span></p>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:700px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
<tbody>
<tr>
<td style="border-left:0;border-right:0;direction:ltr;font-size:0px;padding:0px 20px 0px 20px;text-align:center">
<div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td style="vertical-align:top;padding:20px 40px 20px 40px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td align="center" valign="middle" style="font-size:0px;padding:0;word-break:break-word">
<div style="max-width:400px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%">
<tbody>
<tr>
<td align="center" bgcolor="#9B2AF8" role="presentation" valign="middle" style="border:solid 0px transparent;border-radius:0px;background:#9b2af8">
<a href="https://reedlatino.com/hoteles/" rel="noopener" style="display:inline-block;background:#9b2af8;color:#ffffff;font-family:helvetica,sans-serif;font-size:16px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:12px 40px 12px 40px;border-radius:0px" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://reedlatino.com/hoteles/&amp;source=gmail&amp;ust=1725661402535000&amp;usg=AOvVaw1UrumfNKSeyVizEz0AUaRz"><strong style="font-weight:inherit">Reservar
 hoteles en Cartagena</strong></a><img height="1" src="https://ci3.googleusercontent.com/meips/ADKq_NbboQ5kKZyuJcu9Cjw74YMrli5ymYfELB-qqmtTKc8EQ1-AIyhNMszn1MB9Z9lTK2CIGOyLmozphVgYFqnXK365iBLqEFZt2v7nhT9vYBxThMEt_G5KM4uCPAQ8xJBhFE0Src3n5cl3=s0-d-e1-ft#https://static.wixstatic.com/media/5e9922_0a9111966d7648649336e1f1546c5ec9~mv2.gif" alt="" style="display:block;width:100px!important;height:1px;max-width:100%!important;max-height:1px" class="CToWUd" data-bit="iit"></td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:700px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
<tbody>
<tr>
<td style="border-left:0;border-right:0;direction:ltr;font-size:0px;padding:0px 20px 0px 20px;text-align:center">
<div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td style="vertical-align:top;padding:20px 0px 20px 0px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td align="center" style="font-size:0px;padding:0px;word-break:break-word">
<div style="font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:13px;line-height:1;text-align:center;color:#000000;white-space:pre-wrap">
<a style="display:inline-block;max-width:100%"><img src="https://ci3.googleusercontent.com/meips/ADKq_Nad7NDXFGmR6iADphOqjcv0xjKSTR1YWgKyfNB56EZeu4QsatI9gjmfV5PfQG6uAZe43Kaju6L-ZBdSR-RE7q7WleZxZMjrIfqiavv4fjKx3NKbxFUe9BFVoJXY4TvAsTHsHMYq-mtg2IeGuCyTmUmEgijlekoiCfMotLdllAj0tjGMshlbeDJiO9_y1KMNYdrMFqhsM_cqNpVAVy7G4yP5BmqGvZoY2kRUZ95hymasRUEa3_4tzT0=s0-d-e1-ft#https://static.wixstatic.com/media/2a70ea_5fb0094ccda4487b9b1496532e24a770~mv2.jpg/v1/fit/w_1200,h_2000,al_c,q_85/2a70ea_5fb0094ccda4487b9b1496532e24a770~mv2.jpg" width="auto" alt="" style="display:inline-block;max-width:100%;vertical-align:middle;width:auto" class="CToWUd a6T" data-bit="iit" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 391px; top: 4840.22px;"><span data-is-tooltip-wrapper="true" class="a5q" jsaction="JIbuQc:.CLIENT"><button class="VYBDae-JX-I VYBDae-JX-I-ql-ay5-ays CgzRE" jscontroller="PIVayb" jsaction="click:h5M12e; clickmod:h5M12e;pointerdown:FEiYhc;pointerup:mF5Elf;pointerenter:EX0mI;pointerleave:vpvbp;pointercancel:xyn4sd;contextmenu:xexox;focus:h06R8; blur:zjh6rb;mlnRJb:fLiPzd;" data-idom-class="CgzRE" jsname="hRZeKc" aria-label="Descargar el archivo adjunto " data-tooltip-enabled="true" data-tooltip-id="tt-c137" data-tooltip-classes="AZPksf" id="" jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTgwOTM5Mzg0MjY1ODczNzAxOCJd; 43:WyJpbWFnZS9qcGVnIl0."><span class="OiePBf-zPjgPe VYBDae-JX-UHGRz"></span><span class="bHC-Q" data-unbounded="false" jscontroller="LBaJxb" jsname="m9ZlFb" soy-skip="" ssk="6:RWVI5c"></span><span class="VYBDae-JX-ank-Rtc0Jf" jsname="S5tZuc" aria-hidden="true"><span class="bzc-ank" aria-hidden="true"><svg viewBox="0 -960 960 960" height="20" width="20" focusable="false" class=" aoH"><path d="M480-336L288-528l51-51L444-474V-816h72v342L621-579l51,51L480-336ZM263.72-192Q234-192 213-213.15T192-264v-72h72v72H696v-72h72v72q0,29.7-21.16,50.85T695.96-192H263.72Z"></path></svg></span></span><div class="VYBDae-JX-ano"></div></button><div class="ne2Ple-oshW8e-J9" id="tt-c137" role="tooltip" aria-hidden="true">Descargar</div></span></div></a></div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div style="color:#000000;font-family:helvetica,sans-serif;line-height:1.6;font-size:18px;background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:700px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
<tbody>
<tr>
<td style="border-left:0;border-right:0;direction:ltr;font-size:0px;padding:0px 20px 0px 20px;text-align:center">
<div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td style="background-color:transparent;border:0px none transparent;border-radius:0px;vertical-align:top;padding:20px 40px 20px 40px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td align="left" style="font-size:0px;padding:0px;word-break:break-word">
<div style="font-family:helvetica,sans-serif;font-size:18px;font-style:normal;line-height:1;text-align:left;text-transform:none;color:#000000;white-space:pre-wrap">
<div style="text-align:center">
<p style="margin:0;font-size:24px;line-height:38px"><span style="font-weight:bold">Muchas gracias y nuevamente felicidades por ser parte de los nominados al Reed Latino 2024</span></p>
</div>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:700px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
<tbody>
<tr>
<td style="border-left:0;border-right:0;direction:ltr;font-size:0px;padding:0px 20px 0px 20px;text-align:center">
<div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td style="vertical-align:top;padding:20px 0px 20px 0px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td align="center" style="font-size:0px;padding:0 0 30px;word-break:break-word">
<div style="font-family:helvetica,sans-serif;font-size:22px;font-style:normal;font-weight:normal;line-height:1;text-align:center;text-decoration:none;color:#000000;white-space:pre-wrap">
Síguenos</div>
</td>
</tr>
<tr>
<td align="center" style="font-size:0px;padding:0;word-break:break-word">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table">
<tbody>
<tr>
<td style="padding:0 13px;vertical-align:middle">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:3px;width:28px">
<tbody>
<tr>
<td style="font-size:0;height:28px;vertical-align:middle;width:28px"><a href="https://web.facebook.com/REEDLATINO?_rdc=1&amp;_rdr" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://web.facebook.com/REEDLATINO?_rdc%3D1%26_rdr&amp;source=gmail&amp;ust=1725661402535000&amp;usg=AOvVaw3augviJfY4XT-nJUA8iLky"><img alt="Seguir en Facebook" height="28" src="https://ci3.googleusercontent.com/meips/ADKq_NbzOhFSUdNn8WJLGEiL7ggiLsafP-qVVfv8Ek92-1SJsMHqzI6ChaaqwaUHwkRp8FCv4C02qjhQu4A_8yOqPtkJB-Dk839CqOyDW67pGOAOCPnWvABZqVpNntyz3zut5QdXWy4yhmXy_CqD5fuJzHwxDsA8vnYi2bSBOnrPKJa-VxerOR5wCdN4HpSHoDDD4OoutOaIRyJrPqSxRrmUC5_1d9krLHX9Drj9q93YLubHS1dPy0uTFzhTlUJYVElT4mbsva6uUYkk_0Q=s0-d-e1-ft#https://images.wixstatic.com/media/a306cb_6f69311272764c9094f1795b992fa3c1~mv2.png/v1/fit/w_750,h_750,br_-100,sat_-100,hue_180,lg_0/a306cb_6f69311272764c9094f1795b992fa3c1~mv2.png" width="28" style="border-radius:3px;display:block" class="CToWUd" data-bit="iit"></a></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table">
<tbody>
<tr>
<td style="padding:0 13px;vertical-align:middle">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:3px;width:28px">
<tbody>
<tr>
<td style="font-size:0;height:28px;vertical-align:middle;width:28px"><a href="https://www.instagram.com/reedlatino/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.instagram.com/reedlatino/&amp;source=gmail&amp;ust=1725661402535000&amp;usg=AOvVaw3LKdI63rpEhESbj0KsZ2bO"><img alt="Seguir en Instagram" height="28" src="https://ci3.googleusercontent.com/meips/ADKq_Na0LnULLXHBymyjUm28suhg84ZHEQ5RysDsg49wnCOn0SfcU0YOTqe0VdSZwMk7M9NT6WPFtgqPYtKWddENuovvQx_maznWIZGy15DeC66h0SFyt5Jne00tI7NRibgJ3-HtclHoArc-dt9POuzFX2m7B6mt-p4qU9Lz09YXolsaU3z8zcF75zcF_URyuSlftuZNH8rQqvEecKxWj-BRlQvzKboigq4ebd9GpyoT3GmDCFl7ThpoFa1KLwbU3V1ceKQVFFxezB5AuHI=s0-d-e1-ft#https://images.wixstatic.com/media/a306cb_a46fa514003c41ab906638635f992277~mv2.png/v1/fit/w_750,h_750,br_-100,sat_-100,hue_180,lg_0/a306cb_a46fa514003c41ab906638635f992277~mv2.png" width="28" style="border-radius:3px;display:block" class="CToWUd" data-bit="iit"></a></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table">
<tbody>
<tr>
<td style="padding:0 13px;vertical-align:middle">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:3px;width:28px">
<tbody>
<tr>
<td style="font-size:0;height:28px;vertical-align:middle;width:28px"><a href="https://twitter.com/ReedLatino" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://twitter.com/ReedLatino&amp;source=gmail&amp;ust=1725661402535000&amp;usg=AOvVaw0c0IRFvPOQmNuv3aidsgIR"><img alt="Seguir en X (Twitter)" height="28" src="https://ci3.googleusercontent.com/meips/ADKq_NYiW6WcwyR95AFHXASpoJ1g90WP2iFxgjGtjoG_V49VThyGNufYIF3EEmEAUjdposDpI5QIZbQR7DqH34itCbijy6G7QT3bhREGe3HBieAALbDsJjNic0E-5F66CSUF6IQ8Ogd5--6Fl0K5EIx6AQZJcdIlDYD-Ij8nEKgbnC_vvOmesfeGMzg4oIfmVIEWYtvEDzpa_HT3C4ibpw-feyn4skrwpyrzWzksL6sTeT5eVM5BnXskQGODZWQGpzJgSu2AHfndhzOWEao=s0-d-e1-ft#https://images.wixstatic.com/media/5e9922_88126427794648a2835ac81ee861a6ba~mv2.png/v1/fit/w_750,h_750,br_-100,sat_-100,hue_180,lg_0/5e9922_88126427794648a2835ac81ee861a6ba~mv2.png" width="28" style="border-radius:3px;display:block" class="CToWUd" data-bit="iit"></a></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:700px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%">
<tbody>
<tr>
<td style="border-left:0;border-right:0;direction:ltr;font-size:0px;padding:0px 20px 0px 20px;text-align:center">
<div style="height:10px;padding:20px 40px 0px 40px"></div>
<div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:middle;width:100%;max-width:100%">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td style="vertical-align:middle;padding-right:40px;padding-left:40px">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
<tbody>
<tr>
<td align="center" style="font-size:0px;padding:0px 10px 0px 10px;word-break:break-word">
<div style="font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:13px;line-height:1;text-align:center;color:#000000;white-space:pre-wrap">
<div style="display:inline-block;vertical-align:middle"><a href="https://ceonline.com.mx/so/66P6uynMM/c?w=8Ts6N6JDaCofqSMgqf5-qFLYzZn-MxVTDrBj1aeY98Y.eyJ1IjoiaHR0cHM6Ly9yZWVkbGF0aW5vLmNvbS8iLCJyIjoiZDYwOTM0ODAtOGQ5Yy00YWFkLWEwMWUtNjJiODljODdkZGRiIiwibSI6Im1haWwiLCJjIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIn0" style="text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://ceonline.com.mx/so/66P6uynMM/c?w%3D8Ts6N6JDaCofqSMgqf5-qFLYzZn-MxVTDrBj1aeY98Y.eyJ1IjoiaHR0cHM6Ly9yZWVkbGF0aW5vLmNvbS8iLCJyIjoiZDYwOTM0ODAtOGQ5Yy00YWFkLWEwMWUtNjJiODljODdkZGRiIiwibSI6Im1haWwiLCJjIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIn0&amp;source=gmail&amp;ust=1725661402535000&amp;usg=AOvVaw0UhNZaL-ZQ7TY_dC_7qr_J"><span style="font-family:trebuchet ms,sans-serif;font-size:12px;margin-right:1.5px;line-height:25px;display:inline-block;overflow:hidden;vertical-align:middle;color:#000000;max-height:100px"><strong style="font-weight:inherit">Reed
 Latino 2024</strong></span> &nbsp;<img height="22" src="https://ci3.googleusercontent.com/meips/ADKq_NYgcF9Yn8xz2H-u3BINZImWm8V2KECFZgt6MjDWlhkiVXKy1JjkTnlw73hUmvIOxMZRv4O-D_oSRvr-Qoxt_vjmEN7tEkhoGSI9sOgYEKNfXjiya8VrLZhoLpuziaVZWFdhigxW5OQirhoSX9Zs2fy3Phk4oJIkT2CJ9971TxviQ0zmEi1O9jpeqITFQXCIljZKM8wxcPso_W9MttEJtsMHPcR6WCYSO8s_1TpZcOiZWPCRZWfyBYGBoXQ_L86HMOR6vCYjDGNjHV8=s0-d-e1-ft#https://images.wixstatic.com/media/b49ee3_dd9b1a8812ae41138409a667954a6088~mv2.png/v1/fit/w_750,h_750,br_-100,sat_-100,hue_180,lg_0/b49ee3_dd9b1a8812ae41138409a667954a6088~mv2.png" width="22" alt="" style="vertical-align:middle;border:0" class="CToWUd" data-bit="iit"></a></div>
</div>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
</div>
<div style="height:10px;padding:0px 40px 20px 40px"></div>
</td>
</tr>
</tbody>
</table>
</div>
<div style="margin:0px auto;max-width:700px">
<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%">
<tbody>
<tr>
<td style="border-bottom:0;border-left:0;border-right:0;direction:ltr;font-size:0px;padding:0;text-align:center">
<div style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="vertical-align:top">
<tbody>
<tr>
<td style="background:#ffffff;font-size:0px;word-break:break-word">
<div style="height:0px;line-height:0px">&hairsp;</div>
</td>
</tr>
</tbody>
</table>
</div>
</td>
</tr>
</tbody>
</table>
</div>
</td>
  </body>
  </html>`;

    return mensaje;
  }
}
