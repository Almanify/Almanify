import { TestBed } from '@angular/core/testing';

import { PushMessegingService } from './push-messeging.service';

describe('PushMessegingService', () => {
  let service: PushMessegingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PushMessegingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
