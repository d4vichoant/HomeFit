import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseFrequencyPage } from './exercise-frequency.page';

describe('ExerciseFrequencyPage', () => {
  let component: ExerciseFrequencyPage;
  let fixture: ComponentFixture<ExerciseFrequencyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ExerciseFrequencyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
