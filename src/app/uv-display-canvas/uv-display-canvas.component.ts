import { Component, OnInit, ElementRef } from '@angular/core';
import { ThreeUtilsService, Face } from '../three-utils.service';
import * as THREE from 'three';
import * as _ from 'lodash';

@Component({
  selector: 'app-uv-display-canvas',
  templateUrl: './uv-display-canvas.component.html',
  styleUrls: ['./uv-display-canvas.component.scss']
})
export class UvDisplayCanvasComponent implements OnInit {

  private rendererContainer: any;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  public clearColor = 'salmon';
  public lineColor = 'white';

  constructor(
    private threeUtils: ThreeUtilsService,
    private element: ElementRef,
  ) { }

  ngOnInit() {
    const container = this.element.nativeElement.querySelector('.render-container');
    this.canvas = container.querySelector('canvas');
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    this.ctx = this.canvas.getContext('2d');
  }

  public clearScene(): void {
    // clear the canvas
    if (this.ctx) {
      this.ctx.fillStyle = this.clearColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  public addObject(original: THREE.Group): void {
    const faces = this.generateUVObject(original, 'yellow');
    faces.forEach((face) => {
      this.drawFace(face, this.lineColor);
    });
  }

  private generateUVObject(obj: THREE.Object3D, lineColor: string): Array<Face> {
    let faces = new Array<Face>();

    if (obj.children.length > 0) {
      for (const child of obj.children) {
        if (child instanceof THREE.Mesh) {
          const mesh = <THREE.Mesh>child;
          const meshFaces = this.threeUtils.getUvFaces(mesh.geometry);
          faces = _.concat(faces, meshFaces);
        }
      }
    } else if (obj instanceof THREE.Mesh) {
      const mesh = <THREE.Mesh>obj;
      const meshFaces = this.threeUtils.getUvFaces(mesh.geometry);
      faces = _.concat(faces, meshFaces);
    }
    return faces;
  }

  // Draw the passed face on to the canvas
  private drawFace(face: Face, color: string): void {
    const width = this.canvas.width;
    const height = this.canvas.height;
    this.ctx.beginPath();
    this.ctx.moveTo(face.points[0].x * width, height - face.points[0].y * height);
    this.ctx.lineTo(face.points[1].x * width, height - face.points[1].y * height);
    this.ctx.lineTo(face.points[2].x * width, height - face.points[2].y * height);
    this.ctx.closePath();

    this.ctx.lineWidth = .1;
    this.ctx.strokeStyle = '#666666';
    this.ctx.stroke();

    this.ctx.fillStyle = color;
    this.ctx.fill();
  }
}
