import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarPasswordEventoComponent } from './recuperar-password.component';

describe('RecuperarPasswordEventoComponent', () => {
  let component: RecuperarPasswordEventoComponent;
  let fixture: ComponentFixture<RecuperarPasswordEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecuperarPasswordEventoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperarPasswordEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
