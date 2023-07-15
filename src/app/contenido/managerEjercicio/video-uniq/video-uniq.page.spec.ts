import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoUniqPage } from './video-uniq.page';

describe('VideoUniqPage', () => {
  let component: VideoUniqPage;
  let fixture: ComponentFixture<VideoUniqPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VideoUniqPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
