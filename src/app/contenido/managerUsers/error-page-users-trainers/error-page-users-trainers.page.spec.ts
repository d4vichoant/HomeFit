import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorPageUsersTrainersPage } from './error-page-users-trainers.page';

describe('ErrorPageUsersTrainersPage', () => {
  let component: ErrorPageUsersTrainersPage;
  let fixture: ComponentFixture<ErrorPageUsersTrainersPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ErrorPageUsersTrainersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
