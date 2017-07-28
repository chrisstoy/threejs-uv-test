import { Component, OnInit, ViewChild } from '@angular/core';
import { RenderData } from './render-data';
import * as THREE from 'three';
import { UvDisplayComponent } from './uv-display/uv-display.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public renderData: RenderData;

  constructor(
  ) {
    this.renderData = {
      nearPlane: 0.1,
      farPlane: 1000,
      position: new THREE.Vector3(0, 0, 1),
    };
  }

  ngOnInit(): void {
  }

}
