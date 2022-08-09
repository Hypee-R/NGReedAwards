import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisLugaresComponent } from './mis-lugares.component';

describe('MisLugaresComponent', () => {
  let component: MisLugaresComponent;
  let fixture: ComponentFixture<MisLugaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisLugaresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisLugaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
