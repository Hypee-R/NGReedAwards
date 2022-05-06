import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionNominacionesComponent } from './evaluacion-nominaciones.component';

describe('EvaluacionNominacionesComponent', () => {
  let component: EvaluacionNominacionesComponent;
  let fixture: ComponentFixture<EvaluacionNominacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluacionNominacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluacionNominacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
