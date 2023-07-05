import { NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterDesignerComponent } from './contenido/footer-designer/footer-designer.component';
import { FooterDesignerTrainerComponent } from './contenido/footer-designer-trainer/footer-designer-trainer.component';
import { FooterDesignerUsersComponent } from './contenido/footer-designer-users/footer-designer-users.component';
import { ToolbarDesignerComponent } from './contenido/toolbar-designer/toolbar-designer.component';
import { ToolbarDesignerWhiteComponent } from './contenido/toolbar-designer-white/toolbar-designer-white.component';

@NgModule({
  declarations: [FooterDesignerComponent,ToolbarDesignerComponent,FooterDesignerTrainerComponent,FooterDesignerUsersComponent,ToolbarDesignerWhiteComponent],
  imports: [CommonModule],
  exports: [FooterDesignerComponent,ToolbarDesignerComponent,FooterDesignerTrainerComponent,FooterDesignerUsersComponent,ToolbarDesignerWhiteComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
