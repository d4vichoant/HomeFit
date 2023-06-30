import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramarrutinasPage } from './programarrutinas.page';

describe('ProgramarrutinasPage', () => {
  let component: ProgramarrutinasPage;
  let fixture: ComponentFixture<ProgramarrutinasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProgramarrutinasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
