import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListarParametrosPage } from './listar-parametros.page';

describe('ListarParametrosPage', () => {
  let component: ListarParametrosPage;
  let fixture: ComponentFixture<ListarParametrosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListarParametrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
