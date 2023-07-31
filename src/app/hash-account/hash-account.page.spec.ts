import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HashAccountPage } from './hash-account.page';

describe('HashAccountPage', () => {
  let component: HashAccountPage;
  let fixture: ComponentFixture<HashAccountPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HashAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
