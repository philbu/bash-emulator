/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WhereisService } from './whereis.service';

describe('WhereisService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WhereisService]
    });
  });

  it('should ...', inject([WhereisService], (service: WhereisService) => {
    expect(service).toBeTruthy();
  }));
});
