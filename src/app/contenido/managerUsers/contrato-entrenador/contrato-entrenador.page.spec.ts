import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContratoEntrenadorPage } from './contrato-entrenador.page';

describe('ContratoEntrenadorPage', () => {
  let component: ContratoEntrenadorPage;
  let fixture: ComponentFixture<ContratoEntrenadorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ContratoEntrenadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
