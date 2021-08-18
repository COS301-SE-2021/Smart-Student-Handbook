import { TestBed } from '@angular/core/testing';

import { SharedWithMeService } from './shared-with-me.service';

describe('SharedWithMeService', () => {
  let service: SharedWithMeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedWithMeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
