import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarProgramasRutinasPage } from './listar-programas-rutinas.page';

describe('ListarProgramasRutinasPage', () => {
  let component: ListarProgramasRutinasPage;
  let fixture: ComponentFixture<ListarProgramasRutinasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListarProgramasRutinasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
