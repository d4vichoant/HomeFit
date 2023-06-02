import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearTipoEjercicioPage } from './crear-tipo-ejercicio.page';

describe('CrearTipoEjercicioPage', () => {
  let component: CrearTipoEjercicioPage;
  let fixture: ComponentFixture<CrearTipoEjercicioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CrearTipoEjercicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
