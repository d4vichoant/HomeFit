import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InformeUsuarioPage } from './informe-usuario.page';

describe('InformeUsuarioPage', () => {
  let component: InformeUsuarioPage;
  let fixture: ComponentFixture<InformeUsuarioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InformeUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
