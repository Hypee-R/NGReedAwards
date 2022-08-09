import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReedeventoComponent } from './reedevento.component';

describe('ReedeventoComponent', () => {
  let component: ReedeventoComponent;
  let fixture: ComponentFixture<ReedeventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReedeventoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReedeventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
