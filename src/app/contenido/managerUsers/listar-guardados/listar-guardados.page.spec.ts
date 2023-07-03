import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarGuardadosPage } from './listar-guardados.page';

describe('ListarGuardadosPage', () => {
  let component: ListarGuardadosPage;
  let fixture: ComponentFixture<ListarGuardadosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListarGuardadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
