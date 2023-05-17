import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationPermissionPage } from './notification-permission.page';

describe('NotificationPermissionPage', () => {
  let component: NotificationPermissionPage;
  let fixture: ComponentFixture<NotificationPermissionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NotificationPermissionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
