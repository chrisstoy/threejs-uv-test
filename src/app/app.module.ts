import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';

import { ThreeUtilsService } from './three-utils.service';

import { AppComponent } from './app.component';
import { UvDisplayComponent } from './uv-display/uv-display.component';
import { UvRenderDataFormComponent } from './uv-render-data-form/uv-render-data-form.component';

@NgModule({
  declarations: [
    AppComponent,
    UvDisplayComponent,
    UvRenderDataFormComponent
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
