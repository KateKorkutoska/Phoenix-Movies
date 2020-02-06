import { TestBed } from '@angular/core/testing';

import { BootstrapingMoviesService } from './bootstraping-movies.service';

describe('BootstrapingMoviesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BootstrapingMoviesService = TestBed.get(BootstrapingMoviesService);
    expect(service).toBeTruthy();
  });
});
