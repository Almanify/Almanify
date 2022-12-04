import { TestBed } from '@angular/core/testing';

import { SignUPService } from './sign-up.service';

describe('SignUPService', () => {
  let service: SignUPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignUPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
