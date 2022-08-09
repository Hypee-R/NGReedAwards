import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNominacionComponent } from './add-nominacion.component';

describe('AddNominacionComponent', () => {
  let component: AddNominacionComponent;
  let fixture: ComponentFixture<AddNominacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNominacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNominacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
