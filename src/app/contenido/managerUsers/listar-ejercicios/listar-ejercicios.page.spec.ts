import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarEjerciciosPage } from './listar-ejercicios.page';

describe('ListarEjerciciosPage', () => {
  let component: ListarEjerciciosPage;
  let fixture: ComponentFixture<ListarEjerciciosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListarEjerciciosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
