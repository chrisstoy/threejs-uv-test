import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';

import { ThreeUtilsService } from './three-utils.service';

import { AppComponent } from './app.component';
import { UvDisplayComponent } from './uv-display/uv-display.component';
import { UvRenderDataFormComponent } from './uv-render-data-form/uv-render-data-form.component';
import { ObjectRendererComponent } from './object-renderer/object-renderer.component';
import { RenderControlsComponent } from './render-controls/render-controls.component';
import { UvDisplayCanvasComponent } from './uv-display-canvas/uv-display-canvas.component';

@NgModule({
  declarations: [
    AppComponent,
    UvDisplayComponent,
    UvRenderDataFormComponent,
    ObjectRendererComponent,
    RenderControlsComponent,
    UvDisplayCanvasComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [
    ThreeUtilsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
