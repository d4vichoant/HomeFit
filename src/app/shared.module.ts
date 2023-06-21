import { NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterDesignerComponent } from './contenido/footer-designer/footer-designer.component';
import { FooterDesignerTrainerComponent } from './contenido/footer-designer-trainer/footer-designer-trainer.component';
import { ToolbarDesignerComponent } from './contenido/toolbar-designer/toolbar-designer.component';

@NgModule({
  declarations: [FooterDesignerComponent,ToolbarDesignerComponent,FooterDesignerTrainerComponent],
  imports: [CommonModule],
  exports: [FooterDesignerComponent,ToolbarDesignerComponent,FooterDesignerTrainerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
