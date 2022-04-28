import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from 'src/config/config.service';
import { VariablesService } from '../../../services/variablesGL.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @Input() type: string;
  constructor(
    public configService: ConfigService,
    private variablesGL: VariablesService
  ) {
  }

  ngOnInit(): void {
  }

  logout(){
      this.variablesGL.removeCredential();
  }

}
