import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearRutinasPage } from './crear-rutinas.page';

describe('CrearRutinasPage', () => {
  let component: CrearRutinasPage;
  let fixture: ComponentFixture<CrearRutinasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CrearRutinasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
