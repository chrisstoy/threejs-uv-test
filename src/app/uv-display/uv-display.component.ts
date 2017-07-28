import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, Renderer2, DoCheck } from '@angular/core';
import * as THREE from 'three';
import * as _ from 'lodash';

import { RenderData } from '../render-data';
import { ThreeUtilsService } from '../three-utils.service';

@Component({
  selector: 'app-uv-display',
  templateUrl: './uv-display.component.html',
  styleUrls: ['./uv-display.component.scss']
})
export class UvDisplayComponent implements OnInit, OnChanges, DoCheck {
  @Input() public renderData: RenderData;
  private oldRenderData: RenderData;

  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private light: THREE.Light;


  private rendererContainer: any;

  constructor(
    private threeUtils: ThreeUtilsService,
    private element: ElementRef,
    private htmlRenderer: Renderer2,
  ) { }

  public ngOnInit() {
  }

  public ngDoCheck(): void {
    if (!_.isEqual(this.oldRenderData, this.renderData)) {
      this.oldRenderData = _.cloneDeep(this.renderData);
      this.updateRenderData();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const change = changes['renderData'];
    if (change) {
      if (!_.isEqual(change.currentValue, change.previousValue)) {
        this.oldRenderData = _.cloneDeep(this.renderData);
        this.updateRenderData();
      }
    }
  }

  public updateRenderData(): void {
    if (!this.scene) {
      // scene needs to be initialized
      this.initScene();
    } else {
      this.camera.far = this.renderData.farPlane;
      this.camera.near = this.renderData.nearPlane;
      this.camera.position.x = this.renderData.position.x;
      this.camera.position.y = this.renderData.position.y;
      this.camera.position.z = this.renderData.position.z;
      this.renderer.render(this.scene, this.camera);
    }
  }

  /////////
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

    this.light = new THREE.AmbientLight('white');
    this.scene.add(this.light);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor('skyblue', 1);
    this.renderer.setSize(this.rendererContainer.clientWidth, this.rendererContainer.clientHeight);
    this.htmlRenderer.appendChild(this.rendererContainer, this.renderer.domElement);

    // this.addReferencePointsToScene();
    // this.addTestCubeToScene();

    this.addObjToScene('assets/Collar.obj');

    this.renderer.render(this.scene, this.camera);
  }

  // adds reference points to the corners and center of UV space
  private addReferencePointsToScene(): void {
    // create anchor points for UV space
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
  }

  private addTestCubeToScene(): void {
    this.createTexturedCube().then((cube) => {
      this.scene.add(cube);
      this.threeUtils.generateUVFacesFromMesh(cube.geometry)
        .then((uvLines) => {
          this.scene.add(uvLines);
        });

      this.renderer.render(this.scene, this.camera);

      // spin the cube around
      const animate = function () {
        cube.rotation.x += .04;
        cube.rotation.y += .02;
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(_.bind<FrameRequestCallback>(animate, this));
      };
      animate.apply(this);
    });
  }

  private createTexturedCube(): Promise<THREE.Mesh> {
    const promise = new Promise<THREE.Mesh>((resolve, reject) => {
      //  create the UV mappings
      const bricks = [new THREE.Vector2(0, .666), new THREE.Vector2(.5, .666), new THREE.Vector2(.5, 1), new THREE.Vector2(0, 1)];
      const clouds = [new THREE.Vector2(.5, .666), new THREE.Vector2(1, .666), new THREE.Vector2(1, 1), new THREE.Vector2(.5, 1)];
      const crate = [new THREE.Vector2(0, .333), new THREE.Vector2(.5, .333), new THREE.Vector2(.5, .666), new THREE.Vector2(0, .666)];
      const stone = [new THREE.Vector2(.5, .333), new THREE.Vector2(1, .333), new THREE.Vector2(1, .666), new THREE.Vector2(.5, .666)];
      const water = [new THREE.Vector2(0, 0), new THREE.Vector2(.5, 0), new THREE.Vector2(.5, .333), new THREE.Vector2(0, .333)];
      const wood = [new THREE.Vector2(.5, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, .333), new THREE.Vector2(.5, .333)];

      const geometry = new THREE.CubeGeometry(.5, .5, .5);
      geometry.faceVertexUvs[0] = [];

      _.forEach([bricks, clouds, wood, crate, stone, water], (coords, idx) => {
        geometry.faceVertexUvs[0][2 * idx] = [coords[0], coords[1], coords[3]];
        geometry.faceVertexUvs[0][(2 * idx) + 1] = [coords[1], coords[2], coords[3]];
      });

      this.threeUtils.loadTexture('assets/texture-atlas.jpg')
        .then((texture) => {
          // create and return our cube centered at 0,0
          const material = new THREE.MeshPhongMaterial({ color: 'white', map: texture });
          const cube = new THREE.Mesh(geometry, material);
          cube.position.x = .5;
          cube.position.y = .5;
          resolve(cube);
        });
    });
    return promise;
  }

  private addObjToScene(url: string): void {

    this.threeUtils.loadObj(url)
      .then((obj) => {
        this.scene.add(obj);
        if (obj.children[0] instanceof THREE.Mesh) {
          this.threeUtils.generateUVFacesFromMesh((<THREE.Mesh>obj.children[0]).geometry)
            .then((uvLines) => {
              this.scene.add(uvLines);
              this.renderer.render(this.scene, this.camera);
            });
        }
        this.renderer.render(this.scene, this.camera);
      });
  }
}
