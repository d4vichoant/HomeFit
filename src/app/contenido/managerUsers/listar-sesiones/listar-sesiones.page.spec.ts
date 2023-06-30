import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarSesionesPage } from './listar-sesiones.page';

describe('ListarSesionesPage', () => {
  let component: ListarSesionesPage;
  let fixture: ComponentFixture<ListarSesionesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListarSesionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
