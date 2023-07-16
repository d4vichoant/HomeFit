import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HalfTimePage } from './half-time.page';

describe('HalfTimePage', () => {
  let component: HalfTimePage;
  let fixture: ComponentFixture<HalfTimePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HalfTimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
