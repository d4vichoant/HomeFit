import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearSesionesPage } from './crear-sesiones.page';

describe('CrearSesionesPage', () => {
  let component: CrearSesionesPage;
  let fixture: ComponentFixture<CrearSesionesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CrearSesionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
