import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarSesionesAllPage } from './listar-sesiones-all.page';

describe('ListarSesionesAllPage', () => {
  let component: ListarSesionesAllPage;
  let fixture: ComponentFixture<ListarSesionesAllPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListarSesionesAllPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
