import { TestBed } from '@angular/core/testing';

import { NoteMoreService } from './note-more.service';

describe('NoteMoreService', () => {
  let service: NoteMoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoteMoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
