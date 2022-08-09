import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajesContactoComponent } from './mensajes-contacto.component';

describe('MensajesContactoComponent', () => {
  let component: MensajesContactoComponent;
  let fixture: ComponentFixture<MensajesContactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MensajesContactoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajesContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
