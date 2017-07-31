import { Component, OnInit, ViewChild } from '@angular/core';
import { RenderData } from './render-data';
import * as THREE from 'three';
import { UvDisplayComponent } from './uv-display/uv-display.component';
import { ObjectRendererComponent } from './object-renderer/object-renderer.component';
import { ThreeUtilsService } from './three-utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild(ObjectRendererComponent) objectRenderer: ObjectRendererComponent;
  @ViewChild(UvDisplayComponent) uvRenderer: UvDisplayComponent;

  constructor(
    private threeUtils: ThreeUtilsService,
  ) {
  }

  ngOnInit(): void {
    // load the desired object
    this.loadObject('assets/Cube0.obj');
  }

  // Load the requested object into the displays
  public loadObject(url: string): void {

    // testing: just add a textured cube
    this.threeUtils.createTexturedCube()
      .then((cube) => {
        this.objectRenderer.addObject(cube);
        this.uvRenderer.addObject(cube);
      });

    // this.threeUtils.loadObj(url)
    //   .then((obj) => {
    //     this.objectRenderer.addObject(obj);
    //     this.uvRenderer.addObject(obj);
    //   });
  }

}
