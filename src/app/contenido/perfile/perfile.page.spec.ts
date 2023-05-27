import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilePage } from './perfile.page';

describe('PerfilePage', () => {
  let component: PerfilePage;
  let fixture: ComponentFixture<PerfilePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PerfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
