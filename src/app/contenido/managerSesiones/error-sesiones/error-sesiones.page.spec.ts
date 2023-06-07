import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorSesionesPage } from './error-sesiones.page';

describe('ErrorSesionesPage', () => {
  let component: ErrorSesionesPage;
  let fixture: ComponentFixture<ErrorSesionesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ErrorSesionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
