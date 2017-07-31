import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-render-controls',
  templateUrl: './render-controls.component.html',
  styleUrls: ['./render-controls.component.scss']
})
export class RenderControlsComponent implements OnInit {
  @Output() public modelSelected = new EventEmitter();

  public readonly availableModels = [
    { name: 'Collar', path: 'assets/Collar.obj' },
    { name: 'Sockliner', path: 'assets/Sockliner.obj' },
    { name: 'FOXING_BACKER', path: 'assets/FOXING_BACKER.obj' },
    { name: 'male02', path: 'assets/male02.obj' },
    { name: 'Cube0', path: 'assets/Cube0.obj' },
    { name: 'Cube1', path: 'assets/Cube1.obj' },
    { name: 'Cube2', path: 'assets/Cube2.obj' },
    { name: 'Cube3', path: 'assets/Cube3.obj' },
    { name: 'Cube4', path: 'assets/Cube4.obj' },
  ];

  constructor() { }

  ngOnInit() {
  }

  public onLoadModel(model): void {
    this.modelSelected.emit(model.path);
  }
}
