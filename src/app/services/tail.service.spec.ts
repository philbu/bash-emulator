/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TailService } from './tail.service';

describe('TailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TailService]
    });
  });

  it('should ...', inject([TailService], (service: TailService) => {
    expect(service).toBeTruthy();
  }));
});
