import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterFinishedTrainerPage } from './register-finished-trainer.page';

describe('RegisterFinishedTrainerPage', () => {
  let component: RegisterFinishedTrainerPage;
  let fixture: ComponentFixture<RegisterFinishedTrainerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegisterFinishedTrainerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
