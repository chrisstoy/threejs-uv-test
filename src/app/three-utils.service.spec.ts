import { TestBed, inject } from '@angular/core/testing';

import { ThreeUtilsService } from './three-utils.service';

describe('ThreeUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThreeUtilsService]
    });
  });

  it('should be created', inject([ThreeUtilsService], (service: ThreeUtilsService) => {
    expect(service).toBeTruthy();
  }));
});
