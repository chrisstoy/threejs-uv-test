import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as THREE from 'three';
import * as OBJLoader from 'three-obj-loader';
OBJLoader(THREE);

@Injectable()
export class ThreeUtilsService {

  private textureLoader: THREE.TextureLoader;
  private fontLoader: THREE.FontLoader;
  private objLoader: THREE.OBJLoader;

  constructor() { }

  // Async loading of a texture
  public loadTexture(url): Promise<THREE.Texture> {

    if (!this.textureLoader) {
      this.textureLoader = new THREE.TextureLoader();
    }

    const promise = new Promise<THREE.Texture>((resolve, reject) => {
      this.textureLoader.load(url,
        (texture) => {
          resolve(texture);
        },
        (xhr) => {
          console.log(`loading texture ${url}: ${(xhr.loaded / xhr.total * 100)}% loaded`);
        },
        (error) => {
          console.error(error);
          reject(error);
        });
    });
    return promise;
  }

  // Async loading of a font
  public loadFont(url): Promise<THREE.Font> {
    if (!this.fontLoader) {
      this.fontLoader = new THREE.FontLoader();
    }

    const promise = new Promise<THREE.Font>((resolve, reject) => {
      this.fontLoader.load(url,
        (font) => {
          resolve(font);
        },
        (xhr) => {
          console.log(`loading font ${url}: ${(xhr.loaded / xhr.total * 100)}% loaded`);
        },
        (error) => {
          console.error(error);
          reject(error);
        });

    });
    return promise;
  }

  // Load an OBJ file and return its contents as a Group
  public loadObj(url): Promise<THREE.Group> {
    if (!this.objLoader) {
      this.objLoader = new THREE.OBJLoader();
    }

    const promise = new Promise<THREE.Group>((resolve, reject) => {
      this.objLoader.load(url,
        (obj) => {
          resolve(obj);
        },
        (xhr) => {
          console.log(`loading OBJ ${url}: ${(xhr.loaded / xhr.total * 100)}% loaded`);
        },
        (error) => {
          console.error(error);
          reject(error);
        });

    });
    return promise;
  }

  // Generates lines representing the UV faces. Optionally labels the faces
  public async generateUVFacesFromMesh(sourceGeometry: THREE.Geometry | THREE.BufferGeometry, drawLabels: boolean = false): Promise<THREE.Line> {

    const material = new THREE.LineBasicMaterial({ color: 'yellow' });
    const geometry = new THREE.Geometry();

    sourceGeometry = (sourceGeometry instanceof THREE.BufferGeometry) ? new THREE.Geometry().fromBufferGeometry(sourceGeometry) : sourceGeometry;
    const uvs = sourceGeometry.faceVertexUvs[0];

    _.forEach(uvs, (uvSet) => {
      _.forEach(uvSet, (uv) => {
        geometry.vertices.push(new THREE.Vector3(uv.x, uv.y, 0));
      });
      geometry.vertices.push(new THREE.Vector3(uvSet[0].x, uvSet[0].y, 0)); // close by returning to start
    });

    const lines = new THREE.LineSegments(geometry, material);
    return lines;
  }

    // private createLabelAt(text: string, position: THREE.Vector3, options: any): THREE.Mesh {

  //   const geoOptions = _.merge({
  //     font:
  //   }, options);

  //   const textGeo = new THREE.TextGeometry(text, {
  //     font: font,
  //     size: size,
  //     height: height,
  //     curveSegments: curveSegments,
  //     bevelThickness: bevelThickness,
  //     bevelSize: bevelSize,
  //     bevelEnabled: bevelEnabled,
  //     material: 0,
  //     extrudeMaterial: 1
  //   });
  //   return new THREE.Mesh(textGeo, material);
  // }
}
