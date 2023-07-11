import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarEjerciciosAllPage } from './listar-ejercicios-all.page';

describe('ListarEjerciciosAllPage', () => {
  let component: ListarEjerciciosAllPage;
  let fixture: ComponentFixture<ListarEjerciciosAllPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListarEjerciciosAllPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
