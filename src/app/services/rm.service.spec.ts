/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RmService } from './rm.service';

describe('RmService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RmService]
    });
  });

  it('should ...', inject([RmService], (service: RmService) => {
    expect(service).toBeTruthy();
  }));
});
