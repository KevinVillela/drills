import { TestBed, inject } from '@angular/core/testing';

import { RankingsService } from './rankings.service';

describe('RankingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RankingsService]
    });
  });

  it('should be created', inject([RankingsService], (service: RankingsService) => {
    expect(service).toBeTruthy();
  }));
});
