import { TestBed } from '@angular/core/testing';

import { PushMessagingService } from './push-messaging.service';

describe('PushMessegingService', () => {
  let service: PushMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PushMessagingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
