import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlProgramacionPage } from './control-programacion.page';

describe('ControlProgramacionPage', () => {
  let component: ControlProgramacionPage;
  let fixture: ComponentFixture<ControlProgramacionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ControlProgramacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
