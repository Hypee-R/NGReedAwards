import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginUserEventoComponent } from './login-user.component';

describe('LoginUserEventoComponent', () => {
  let component: LoginUserEventoComponent;
  let fixture: ComponentFixture<LoginUserEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginUserEventoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginUserEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
