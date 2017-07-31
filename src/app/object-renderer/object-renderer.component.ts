import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import * as THREE from 'three';
import * as OrbitControlsFactory from 'three-orbit-controls';
const OrbitControls = OrbitControlsFactory(THREE);
import * as _ from 'lodash';

import { ThreeUtilsService } from '../three-utils.service';

@Component({
  selector: 'app-object-renderer',
  templateUrl: './object-renderer.component.html',
  styleUrls: ['./object-renderer.component.scss']
})
export class ObjectRendererComponent implements OnInit {

  private rendererContainer: any;

  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private renderer: THREE.WebGLRenderer;
  private light: THREE.Light;
  private controls: THREE.OrbitControls;

  public nearPlane = 0.1;
  public farPlane = 1000.0;
  public fov = 45;
  public aspectRatio = 1;

  constructor(
    private threeUtils: ThreeUtilsService,
    private element: ElementRef,
    private htmlRenderer: Renderer2,
  ) { }

  ngOnInit() {
    this.initScene();
  }

  private initScene(): void {

    // get the element that will hold our render canvas
    this.rendererContainer = this.element.nativeElement.querySelector('.render-container');
    const width = this.rendererContainer.clientWidth;
    const height = this.rendererContainer.clientHeight;
    this.scene = new THREE.Scene();

    // set up ortho camera so we have a display of 0->1
    this.camera = new THREE.PerspectiveCamera(this.fov, this.aspectRatio, this.nearPlane, this.farPlane);
    this.camera.position.set(0, 0, 2);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);

    this.light = new THREE.AmbientLight('white');
    this.scene.add(this.light);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor('green', 1);
    this.renderer.setSize(this.rendererContainer.clientWidth, this.rendererContainer.clientHeight);
    this.htmlRenderer.appendChild(this.rendererContainer, this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.rendererContainer);

    // set up animation loop so we continue to render the scene. Needed for orbit controls to work
    const animate = function () {
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(_.bind<FrameRequestCallback>(animate, this));
    };
    animate.apply(this);


  }

  public addObject(obj: THREE.Object3D): void {
    this.scene.add(obj);
    this.renderer.render(this.scene, this.camera);
  }

  public clearScene(): void {
    this.threeUtils.clearScene(this.scene);
  }

  public createCube(useAnimation: boolean): Promise<THREE.Mesh> {
    return this.threeUtils.createTexturedCube()
      .then((cube) => {

        // spin the cube around
        if (useAnimation) {
          const animate = function () {
            // cube.rotation.x += .04;
            // cube.rotation.y += .02;
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(_.bind<FrameRequestCallback>(animate, this));
          };
          animate.apply(this);
        }

        return cube;
      });
  }

}
