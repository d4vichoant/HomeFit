import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObjetivePage } from './objetive.page';

describe('ObjetivePage', () => {
  let component: ObjetivePage;
  let fixture: ComponentFixture<ObjetivePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ObjetivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
