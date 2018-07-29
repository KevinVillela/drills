import { TestBed, inject } from '@angular/core/testing';

import { CadetService } from './cadet.service';

describe('CadetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CadetService]
    });
  });

  it('should be created', inject([CadetService], (service: CadetService) => {
    expect(service).toBeTruthy();
  }));
});
