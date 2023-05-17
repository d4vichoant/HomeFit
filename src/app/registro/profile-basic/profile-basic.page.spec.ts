import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileBasicPage } from './profile-basic.page';

describe('ProfileBasicPage', () => {
  let component: ProfileBasicPage;
  let fixture: ComponentFixture<ProfileBasicPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProfileBasicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
