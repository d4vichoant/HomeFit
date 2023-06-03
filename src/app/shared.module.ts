import { NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterDesignerComponent } from './contenido/footer-designer/footer-designer.component';
import { ToolbarDesignerComponent } from './contenido/toolbar-designer/toolbar-designer.component';

@NgModule({
  declarations: [FooterDesignerComponent,ToolbarDesignerComponent],
  imports: [CommonModule],
  exports: [FooterDesignerComponent,ToolbarDesignerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
