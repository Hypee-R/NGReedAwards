import { Component, OnInit } from '@angular/core';
import { NominacionService } from 'src/app/services/nominacion.service';
import { ToastrService } from 'ngx-toastr';



declare var paypal;

@Component({
  selector: 'app-mis-nominaciones',
  templateUrl: './mis-nominaciones.component.html',
  styleUrls: ['./mis-nominaciones.component.css']
})
export class MisNominacionesComponent implements OnInit {

  visibleSide: boolean;
  listNominaciones: any;
  loading: boolean = true;
  constructor(
    private toastr: ToastrService,
    private nominacionesService: NominacionService
  ) {
    this.getNominaciones();
  }

  ngOnInit(): void {
  }

  getNominaciones(){
    this.nominacionesService.getNominaciones().subscribe(data => {
        if(data){
          console.log('data nominaciones ', data.filter(x => x?.uid == 'D7kwQZ3OPIaPq5FMHthNgNAgiZU2'));
          let uid = JSON.parse(localStorage.d).uid;
          this.listNominaciones = data.filter(x => x?.uid == uid);
          this.loading = false;
        }
    },
    err => {
      this.toastr.error('Hubo un problema al obtener las nominaciones, intentelo más tarde...','Error')
      this.loading = false;
    }
    );
  }

}
