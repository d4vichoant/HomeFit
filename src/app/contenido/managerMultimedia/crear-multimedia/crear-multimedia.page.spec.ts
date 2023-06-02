import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearMultimediaPage } from './crear-multimedia.page';

describe('CrearMultimediaPage', () => {
  let component: CrearMultimediaPage;
  let fixture: ComponentFixture<CrearMultimediaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CrearMultimediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
