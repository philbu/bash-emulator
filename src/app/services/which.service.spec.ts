/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WhichService } from './which.service';

describe('WhichService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WhichService]
    });
  });

  it('should ...', inject([WhichService], (service: WhichService) => {
    expect(service).toBeTruthy();
  }));
});
