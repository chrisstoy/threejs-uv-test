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

  public loadedModel = '';

  constructor(
    private threeUtils: ThreeUtilsService,
  ) {
  }

  ngOnInit(): void {
    // load the desired object
//    this.loadObject('assets/male02.obj');
    this.loadObject('assets/Cube3.obj');
  }

  // Load the requested object into the displays
  public loadObject(url: string): void {

    this.loadedModel = url;

    this.objectRenderer.clearScene();
    this.uvRenderer.clearScene();

    // testing: just add a textured cube
    // this.threeUtils.createTexturedCube()
    //   .then((cube) => {
    //     this.objectRenderer.addObject(cube);
    //     this.uvRenderer.addObject(cube);
    //   });

    this.threeUtils.loadObj(url)
      .then((obj) => {
        this.objectRenderer.addObject(obj);
        this.uvRenderer.addObject(obj);
      });

  }



}
