import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersTrainersPage } from './users-trainers.page';

describe('UsersTrainersPage', () => {
  let component: UsersTrainersPage;
  let fixture: ComponentFixture<UsersTrainersPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UsersTrainersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
