import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UvRenderDataFormComponent } from './uv-render-data-form.component';

describe('UvRenderDataFormComponent', () => {
  let component: UvRenderDataFormComponent;
  let fixture: ComponentFixture<UvRenderDataFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UvRenderDataFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UvRenderDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
