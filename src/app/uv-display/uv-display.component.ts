import { Component, OnInit, Input, ElementRef, Renderer2 } from '@angular/core';
import * as THREE from 'three';
import * as _ from 'lodash';

import { ThreeUtilsService } from '../three-utils.service';

@Component({
  selector: 'app-uv-display',
  templateUrl: './uv-display.component.html',
  styleUrls: ['./uv-display.component.scss']
})
export class UvDisplayComponent implements OnInit {

  public nearPlane = 0.1;
  public farPlane = 1000.0;

  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private light: THREE.Light;
  private background: THREE.Mesh;

  private rendererContainer: any;

  constructor(
    private threeUtils: ThreeUtilsService,
    private element: ElementRef,
    private htmlRenderer: Renderer2,
  ) { }

  public ngOnInit() {
    this.initScene();
  }

  public clearScene(): void {
    this.threeUtils.clearScene(this.scene);
  }

  public addObject(original: THREE.Group): void {
    this.generateUVObject(original, 'yellow')
      .then((uvObj) => {
        this.scene.add(uvObj);
        const mesh = <THREE.Mesh>original.children[0];
        this.setBackground(mesh.material);
        this.renderer.render(this.scene, this.camera);
      });
  }

  // set the material to render in the background
  public setBackground(material: THREE.Material): void {
    if (!this.background) {
      const geometry = new THREE.PlaneGeometry(1, 1);
      this.background = new THREE.Mesh(geometry, material);
      this.background.position.set(.5, .5, 0);
      this.scene.add(this.background);
    } else {
      this.background.material = material;
    }

    this.renderer.render(this.scene, this.camera);
  }

  //////

  private initScene(): void {
    // get the element that will hold our render canvas
    this.rendererContainer = this.element.nativeElement.querySelector('.render-container');
    const width = this.rendererContainer.clientWidth;
    const height = this.rendererContainer.clientHeight;
    this.scene = new THREE.Scene();

    // set up ortho camera so we have a display of 0->1
    this.camera = new THREE.OrthographicCamera(0, 1, 1, 0, this.nearPlane, this.farPlane);
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));
    this.scene.add(this.camera);

    this.light = new THREE.AmbientLight('white');
    this.scene.add(this.light);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor('skyblue', 1);
    this.renderer.setSize(this.rendererContainer.clientWidth, this.rendererContainer.clientHeight);
    this.htmlRenderer.appendChild(this.rendererContainer, this.renderer.domElement);

    // this.addReferencePointsToScene();

    this.renderer.render(this.scene, this.camera);
  }

  // Generate a Group object with the UV geometry for the passed object
  private generateUVObject(obj: THREE.Object3D, lineColor: string): Promise<THREE.Group> {
    return new Promise<THREE.Group>((resolve) => {
      const promises: Promise<THREE.Line>[] = [];
      const group = new THREE.Group();
      if (obj.children.length > 0) {
        for (const child of obj.children) {
          if (child instanceof THREE.Mesh) {
            const mesh = <THREE.Mesh>child;
            promises.push(
              this.generateUVLineSegments(mesh.geometry)
                .then((uvGeometry) => {
                  const material = new THREE.LineBasicMaterial({ color: lineColor });
                  const lines = new THREE.LineSegments(uvGeometry, material);
                  return lines;
                }));
          }
          return Promise.all(promises)
            .then((lines) => {
              _.forEach(lines, (line: THREE.Object3D) => {
                group.add(line);
              });
              resolve(group);
            });
        }
        resolve(group);
      } else if (obj instanceof THREE.Mesh) {
        const mesh = <THREE.Mesh>obj;

        this.setBackground(mesh.material);

        this.generateUVLineSegments(mesh.geometry)
          .then((uvGeometry) => {
            const material = new THREE.LineBasicMaterial({ color: lineColor });
            const lines = new THREE.LineSegments(uvGeometry, material);
            group.add(lines);
            resolve(group);
          });
      }
    });
  }

  // Generates Geometry LineSegments representing the UV faces of the passed object.
  private async generateUVLineSegments(sourceGeometry: THREE.Geometry | THREE.BufferGeometry): Promise<THREE.Geometry> {

    const geometry = new THREE.Geometry();

    sourceGeometry = (sourceGeometry instanceof THREE.BufferGeometry) ? new THREE.Geometry().fromBufferGeometry(sourceGeometry) : sourceGeometry;
    const faceUvs = sourceGeometry.faceVertexUvs[0];

    const points = [[0, 1], [1, 2], [2, 0]];

    _.forEach(faceUvs, (uvs, faceIdx) => {
      _.forEach(points, (idx) => {
        const p1 = new THREE.Vector3(uvs[idx[0]].x, uvs[idx[0]].y, 0);
        const p2 = new THREE.Vector3(uvs[idx[1]].x, uvs[idx[1]].y, 0);
        geometry.vertices.push(p1);
        geometry.vertices.push(p2);

        // const v1 = new THREE.Mesh(new THREE.SphereGeometry(.01), new THREE.MeshBasicMaterial({ color: 'green' }));
        // v1.position.set(p1.x, p1.y, p1.z);
        // this.scene.add(v1);
      });
      console.log(`- adding UV face ${faceIdx}`);
    });

    return geometry;
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
}
