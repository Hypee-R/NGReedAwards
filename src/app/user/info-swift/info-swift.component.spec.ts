import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSwiftComponent } from './info-swift.component';

describe('InfoSwiftComponent', () => {
  let component: InfoSwiftComponent;
  let fixture: ComponentFixture<InfoSwiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoSwiftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSwiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
