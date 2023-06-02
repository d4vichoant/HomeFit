import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearObjetivoMuscularPage } from './crear-objetivo-muscular.page';

describe('CrearObjetivoMuscularPage', () => {
  let component: CrearObjetivoMuscularPage;
  let fixture: ComponentFixture<CrearObjetivoMuscularPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CrearObjetivoMuscularPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
