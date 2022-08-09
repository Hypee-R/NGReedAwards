import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarEventoComponent } from './nav-bar-evento.component';

describe('NavBarComponent', () => {
  let component: NavBarEventoComponent;
  let fixture: ComponentFixture<NavBarEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavBarEventoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
