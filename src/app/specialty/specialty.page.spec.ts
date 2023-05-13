import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpecialtyPage } from './specialty.page';

describe('SpecialtyPage', () => {
  let component: SpecialtyPage;
  let fixture: ComponentFixture<SpecialtyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SpecialtyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
