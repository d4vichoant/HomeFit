import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ToolbarDesignerWhiteComponent } from './toolbar-designer-white.component';

describe('ToolbarDesignerWhiteComponent', () => {
  let component: ToolbarDesignerWhiteComponent;
  let fixture: ComponentFixture<ToolbarDesignerWhiteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarDesignerWhiteComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ToolbarDesignerWhiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
