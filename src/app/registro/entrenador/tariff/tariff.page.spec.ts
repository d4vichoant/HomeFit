import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TariffPage } from './tariff.page';

describe('TariffPage', () => {
  let component: TariffPage;
  let fixture: ComponentFixture<TariffPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TariffPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
