import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivateEntrenadoresPage } from './activate-entrenadores.page';

describe('ActivateEntrenadoresPage', () => {
  let component: ActivateEntrenadoresPage;
  let fixture: ComponentFixture<ActivateEntrenadoresPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ActivateEntrenadoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
