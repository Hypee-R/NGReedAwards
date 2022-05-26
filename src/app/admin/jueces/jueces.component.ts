import { Component, OnInit } from '@angular/core';
import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-jueces',
  templateUrl: './jueces.component.html',
  styleUrls: ['./jueces.component.css']
})
export class JuecesComponent implements OnInit {
jueses: any;
  constructor(
    
  ) { 

  }

  ngOnInit(): void {
  }
  
}
