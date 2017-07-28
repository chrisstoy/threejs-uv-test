import { Component, OnInit, Input } from '@angular/core';
import { RenderData } from '../render-data';

@Component({
  selector: 'app-uv-render-data-form',
  templateUrl: './uv-render-data-form.component.html',
  styleUrls: ['./uv-render-data-form.component.scss']
})
export class UvRenderDataFormComponent implements OnInit {
  @Input() renderData: RenderData;

  constructor() { }

  ngOnInit() {
  }

}
