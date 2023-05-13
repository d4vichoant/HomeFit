import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrithdayPage } from './brithday.page';

describe('BrithdayPage', () => {
  let component: BrithdayPage;
  let fixture: ComponentFixture<BrithdayPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BrithdayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
