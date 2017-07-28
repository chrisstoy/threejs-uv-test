import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, Renderer2 } from '@angular/core';
import * as THREE from 'three';
import * as _ from 'lodash';

import { RenderData } from '../render-data';

@Component({
  selector: 'app-uv-display',
  templateUrl: './uv-display.component.html',
  styleUrls: ['./uv-display.component.scss']
})
export class UvDisplayComponent implements OnInit, OnChanges {
  @Input() public renderData: RenderData;

  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private rendererContainer: any;

  constructor(
    private element: ElementRef,
    private htmlRenderer: Renderer2,
  ) { }

  public ngOnInit() {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const change = changes['renderData'];
    if (change) {
      if (!_.isEqual(change.currentValue, change.previousValue)) {
        this.updateScene();
      }
    }
  }

  private initScene(): void {

    // get the element that will hold our render canvas
    this.rendererContainer = this.element.nativeElement.querySelector('.render-container');
    const width = this.rendererContainer.clientWidth;
    const height = this.rendererContainer.clientHeight;
    this.scene = new THREE.Scene();

    // set up ortho camera so we have a display of 0->1
    this.camera = new THREE.OrthographicCamera(0, 1, 1, 0, this.renderData.nearPlane, this.renderData.farPlane);
    this.camera.position.x = this.renderData.position.x;
    this.camera.position.y = this.renderData.position.y;
    this.camera.position.z = this.renderData.position.z;
    this.camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor('skyblue', 1);
    this.renderer.setSize(this.rendererContainer.clientWidth, this.rendererContainer.clientHeight);
    this.htmlRenderer.appendChild(this.rendererContainer, this.renderer.domElement);

    // create a test cube
    const points = [
      { u: 0, v: 0, color: 'red' },
      { u: 0, v: 1, color: 'green' },
      { u: 1, v: 1, color: 'blue' },
      { u: 1, v: 0, color: 'yellow' },
      { u: 0.5, v: 0.5, color: 'magenta' },
    ];

    _.forEach(points, (point) => {
      const obj = new THREE.Mesh(new THREE.SphereGeometry(.01), new THREE.MeshBasicMaterial({ color: point.color }));
      obj.position.x = point.u;
      obj.position.y = point.v;
      this.scene.add(obj);
    });

    this.renderer.render(this.scene, this.camera);
  }

  public updateScene(): void {
    if (!this.scene) {
      // scene needs to be initialized
      this.initScene();
    } else {
      // this.camera.fov = this.renderData.fov;
      this.camera.position.x = this.renderData.position.x;
      this.camera.position.y = this.renderData.position.y;
      this.camera.position.z = this.renderData.position.z;
      this.renderer.render(this.scene, this.camera);
    }

  }

}
