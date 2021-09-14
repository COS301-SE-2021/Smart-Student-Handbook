import { TestBed } from '@angular/core/testing';

import { SmartAssistObservablesService } from './smart-assist-observables.service';

describe('SmartAssistObservablesService', () => {
  let service: SmartAssistObservablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartAssistObservablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
