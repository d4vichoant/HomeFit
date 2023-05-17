import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotactivatePage } from './notactivate.page';

describe('NotactivatePage', () => {
  let component: NotactivatePage;
  let fixture: ComponentFixture<NotactivatePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NotactivatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
