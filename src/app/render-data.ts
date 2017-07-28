import * as THREE from 'three';

// Holds all data for render setup
export interface RenderData {

  // camera settings
  farPlane: number;
  nearPlane: number;
  position: THREE.Vector3;
}
