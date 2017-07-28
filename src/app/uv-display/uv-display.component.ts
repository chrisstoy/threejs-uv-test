import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, Renderer2, DoCheck } from '@angular/core';
import * as THREE from 'three';
import * as _ from 'lodash';

import { RenderData } from '../render-data';

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
  private textureLoader: THREE.TextureLoader;

  private rendererContainer: any;

  constructor(
    private element: ElementRef,
    private htmlRenderer: Renderer2,
  ) { }

  public ngOnInit() {
  }

  public ngDoCheck(): void {
    if (!_.isEqual(this.oldRenderData, this.renderData)) {
      this.oldRenderData = _.cloneDeep(this.renderData);
      this.updateScene();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const change = changes['renderData'];
    if (change) {
      if (!_.isEqual(change.currentValue, change.previousValue)) {
        this.oldRenderData = _.cloneDeep(this.renderData);
        this.updateScene();
      }
    }
  }

  public updateScene(): void {
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
    // this.light = new THREE.DirectionalLight( 0xffffff );
    // this.light.position.set( 0, 1, 1 ).normalize();
    this.scene.add(this.light);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor('skyblue', 1);
    this.renderer.setSize(this.rendererContainer.clientWidth, this.rendererContainer.clientHeight);
    this.htmlRenderer.appendChild(this.rendererContainer, this.renderer.domElement);

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

    this.getCube().then((cube) => {
      this.scene.add(cube);
      this.renderer.render(this.scene, this.camera);
    });

    this.renderer.render(this.scene, this.camera);
  }

  private async getCube(): Promise<THREE.Mesh> {
    const promise = new Promise<THREE.Mesh> ( (resolve, reject) => {
    //  create the UV mappings
    const bricks = [new THREE.Vector2(0, .666), new THREE.Vector2(.5, .666), new THREE.Vector2(.5, 1), new THREE.Vector2(0, 1)];
    const clouds = [new THREE.Vector2(.5, .666), new THREE.Vector2(1, .666), new THREE.Vector2(1, 1), new THREE.Vector2(.5, 1)];
    const crate = [new THREE.Vector2(0, .333), new THREE.Vector2(.5, .333), new THREE.Vector2(.5, .666), new THREE.Vector2(0, .666)];
    const stone = [new THREE.Vector2(.5, .333), new THREE.Vector2(1, .333), new THREE.Vector2(1, .666), new THREE.Vector2(.5, .666)];
    const water = [new THREE.Vector2(0, 0), new THREE.Vector2(.5, 0), new THREE.Vector2(.5, .333), new THREE.Vector2(0, .333)];
    const wood = [new THREE.Vector2(.5, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, .333), new THREE.Vector2(.5, .333)];

    const geometry = new THREE.CubeGeometry(.5, .5, .5);
    // geometry.faceVertexUvs[0] = [];
    // geometry.faceVertexUvs[0][0] = [bricks[0], bricks[1], bricks[3]];
    // geometry.faceVertexUvs[0][1] = [bricks[1], bricks[2], bricks[3]];

    // geometry.faceVertexUvs[0][2] = [clouds[0], clouds[1], clouds[3]];
    // geometry.faceVertexUvs[0][3] = [clouds[1], clouds[2], clouds[3]];

    // geometry.faceVertexUvs[0][4] = [crate[0], crate[1], crate[3]];
    // geometry.faceVertexUvs[0][5] = [crate[1], crate[2], crate[3]];

    // geometry.faceVertexUvs[0][6] = [stone[0], stone[1], stone[3]];
    // geometry.faceVertexUvs[0][7] = [stone[1], stone[2], stone[3]];

    // geometry.faceVertexUvs[0][8] = [water[0], water[1], water[3]];
    // geometry.faceVertexUvs[0][9] = [water[1], water[2], water[3]];

    // geometry.faceVertexUvs[0][10] = [wood[0], wood[1], wood[3]];
    // geometry.faceVertexUvs[0][11] = [wood[1], wood[2], wood[3]];

    this.loadTexture('assets/crate.jpg')
      .then((texture) => {
        const material = new THREE.MeshPhongMaterial({ color: 'white', map: texture });
        // const material = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('assets/texture-atlas.jpg') });

        // create and return our cube centered at 0,0
        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = .5;
        cube.position.y = .5;
        resolve(cube);
      });
    });
    return promise;
  }

  private loadTexture(url): Promise<THREE.Texture> {

    if (!this.textureLoader) {
      this.textureLoader = new THREE.TextureLoader();
    }

    const promise = new Promise<THREE.Texture>((resolve, reject) => {
      this.textureLoader.load(url,
        (texture) => {
          resolve(texture);
        },
        (xhr) => {
          console.log(`loading ${url}: ${(xhr.loaded / xhr.total * 100)}% loaded`);
        },
        (error) => {
          console.error(error);
          reject(error);
        });
    });
    return promise;
  }

}
