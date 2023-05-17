import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdditionalPage } from './additional.page';

describe('AdditionalPage', () => {
  let component: AdditionalPage;
  let fixture: ComponentFixture<AdditionalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdditionalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
