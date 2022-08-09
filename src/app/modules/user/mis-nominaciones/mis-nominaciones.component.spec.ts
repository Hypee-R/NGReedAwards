import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisNominacionesComponent } from './mis-nominaciones.component';

describe('MisNominacionesComponent', () => {
  let component: MisNominacionesComponent;
  let fixture: ComponentFixture<MisNominacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisNominacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisNominacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
