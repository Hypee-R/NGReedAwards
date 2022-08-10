import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAdminEventoComponent } from './login-admin.component';

describe('LoginAdminEventoComponent', () => {
  let component: LoginAdminEventoComponent;
  let fixture: ComponentFixture<LoginAdminEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginAdminEventoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginAdminEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
