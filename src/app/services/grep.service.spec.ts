/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GrepService } from './grep.service';

describe('GrepService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GrepService]
    });
  });

  it('should ...', inject([GrepService], (service: GrepService) => {
    expect(service).toBeTruthy();
  }));
});
