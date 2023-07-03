import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EjercicioUniqPage } from './ejercicio-uniq.page';

describe('EjercicioUniqPage', () => {
  let component: EjercicioUniqPage;
  let fixture: ComponentFixture<EjercicioUniqPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EjercicioUniqPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
