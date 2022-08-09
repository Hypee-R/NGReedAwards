import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReedeventoadminComponent } from './reedeventoadmin.component';

describe('ReedeventoadminComponent', () => {
  let component: ReedeventoadminComponent;
  let fixture: ComponentFixture<ReedeventoadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReedeventoadminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReedeventoadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
