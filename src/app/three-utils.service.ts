import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as THREE from 'three';
import * as OBJLoaderFactory from 'three-obj-loader';
const OBJLoader = OBJLoaderFactory(THREE);

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

          this.loadTexture('assets/male-02-1noCulling.JPG')
            .then((texture) => {
              // create and return our cube centered at 0,0
              const material = new THREE.MeshPhongMaterial({ color: 'white', map: texture });
              _.forEach(obj.children, (mesh: THREE.Mesh) => {
                mesh.material = material;
              });
              resolve(obj);
            });

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

  // Create a texture-mapped Cube for testing
  public createTexturedCube(): Promise<THREE.Mesh> {
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

      this.loadTexture('assets/texture-atlas.jpg')
        .then((texture) => {
          // create and return our cube centered at 0,0
          const material = new THREE.MeshPhongMaterial({ color: 'white', map: texture });
          const cube = new THREE.Mesh(geometry, material);
          resolve(cube);
        });
    });
    return promise;
  }

  // Remove all Objects in the scene
  public clearScene(scene: THREE.Scene): void {
    if (scene && _.isArrayLike(scene.children)) {
      for (let i = scene.children.length - 1; i >= 0; i--) {
        const child = scene.children[i];

        if (!(child instanceof THREE.Camera) && !(child instanceof THREE.Light)) {
          // don't remove the Camera
          scene.remove(child);
        }
      }
    }
  }

  // Calculate the radius of the sphere centered at origin that encompases all objects in the scene
  public sceneBoundingRadius(scene: THREE.Scene): number {

    const getMaxRadius = (accum: number, obj: THREE.Object3D) => {
      if (obj instanceof THREE.Mesh) {
        const mesh = <THREE.Mesh>(obj);
        mesh.geometry.computeBoundingSphere();
        const bsphere = mesh.geometry.boundingSphere;
        return Math.max(bsphere.radius + bsphere.center.length(), accum);

      } else if (obj instanceof THREE.Group) {
        return _.reduce(obj.children, getMaxRadius, accum);
      } else {
        return accum;
      }
    };

    const radius = _.reduce(scene.children, getMaxRadius, 1);
    return radius;
  }
}
