import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarRutinasDiariasPage } from './listar-rutinas-diarias.page';

describe('ListarRutinasDiariasPage', () => {
  let component: ListarRutinasDiariasPage;
  let fixture: ComponentFixture<ListarRutinasDiariasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListarRutinasDiariasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
