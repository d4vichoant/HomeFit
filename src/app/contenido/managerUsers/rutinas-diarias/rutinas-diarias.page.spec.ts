import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RutinasDiariasPage } from './rutinas-diarias.page';

describe('RutinasDiariasPage', () => {
  let component: RutinasDiariasPage;
  let fixture: ComponentFixture<RutinasDiariasPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RutinasDiariasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
