import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorUsersPage } from './error-users.page';

describe('ErrorUsersPage', () => {
  let component: ErrorUsersPage;
  let fixture: ComponentFixture<ErrorUsersPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ErrorUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
