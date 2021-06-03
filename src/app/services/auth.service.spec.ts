import { TestBed } from '@angular/core/testing';

import { AngularFireAuthModule } from "@angular/fire/auth";

describe('AuthService', () => {
  let service: AngularFireAuthModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AngularFireAuthModule]
    });
    service = TestBed.inject(AngularFireAuthModule);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
