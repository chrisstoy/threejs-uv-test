import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UvDisplayComponent } from './uv-display.component';

describe('UvDisplayComponent', () => {
  let component: UvDisplayComponent;
  let fixture: ComponentFixture<UvDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UvDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UvDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
