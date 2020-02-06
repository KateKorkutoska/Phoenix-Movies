import { TestBed } from '@angular/core/testing';

import { BootstrapingUserService } from './bootstraping-user.service';

describe('BootstrapingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BootstrapingUserService = TestBed.get(BootstrapingUserService);
    expect(service).toBeTruthy();
  });
});
