import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UvDisplayCanvasComponent } from './uv-display-canvas.component';

describe('UvDisplayCanvasComponent', () => {
  let component: UvDisplayCanvasComponent;
  let fixture: ComponentFixture<UvDisplayCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UvDisplayCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UvDisplayCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
