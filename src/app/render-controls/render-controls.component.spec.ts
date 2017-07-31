import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderControlsComponent } from './render-controls.component';

describe('RenderControlsComponent', () => {
  let component: RenderControlsComponent;
  let fixture: ComponentFixture<RenderControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenderControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
