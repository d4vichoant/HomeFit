import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearERequeridoPage } from './crear-erequerido.page';

describe('CrearERequeridoPage', () => {
  let component: CrearERequeridoPage;
  let fixture: ComponentFixture<CrearERequeridoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CrearERequeridoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
