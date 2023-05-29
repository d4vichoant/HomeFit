import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearEjercicioPage } from './crear-ejercicio.page';

describe('CrearEjercicioPage', () => {
  let component: CrearEjercicioPage;
  let fixture: ComponentFixture<CrearEjercicioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CrearEjercicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
