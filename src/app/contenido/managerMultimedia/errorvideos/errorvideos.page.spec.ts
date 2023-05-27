import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorvideosPage } from './errorvideos.page';

describe('ErrorvideosPage', () => {
  let component: ErrorvideosPage;
  let fixture: ComponentFixture<ErrorvideosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ErrorvideosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
