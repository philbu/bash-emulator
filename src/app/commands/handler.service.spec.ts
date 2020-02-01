import { TestBed, inject } from '@angular/core/testing';

import { HandlerService } from './handler.service';

describe('HandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HandlerService]
    });
  });

  it('should be created', inject([HandlerService], (service: HandlerService) => {
    expect(service).toBeTruthy();
  }));
});
