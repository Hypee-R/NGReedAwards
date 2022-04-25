import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  @Input() inputBackground: boolean = false;
  inputBG: boolean = false;
  constructor() {
    this.inputBG = this.inputBackground;
  }

  ngOnInit(): void {
  }

}
