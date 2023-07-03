import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataEntrenadorPage } from './data-entrenador.page';

describe('DataEntrenadorPage', () => {
  let component: DataEntrenadorPage;
  let fixture: ComponentFixture<DataEntrenadorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DataEntrenadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
