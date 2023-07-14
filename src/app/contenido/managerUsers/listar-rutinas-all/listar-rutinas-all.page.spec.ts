import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarRutinasAllPage } from './listar-rutinas-all.page';

describe('ListarRutinasAllPage', () => {
  let component: ListarRutinasAllPage;
  let fixture: ComponentFixture<ListarRutinasAllPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListarRutinasAllPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
