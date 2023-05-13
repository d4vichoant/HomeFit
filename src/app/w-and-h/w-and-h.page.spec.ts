import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WAndHPage } from './w-and-h.page';

describe('WAndHPage', () => {
  let component: WAndHPage;
  let fixture: ComponentFixture<WAndHPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WAndHPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
