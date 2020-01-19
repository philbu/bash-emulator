/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FindService } from './find.service';

describe('FindService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FindService]
    });
  });

  it('should ...', inject([FindService], (service: FindService) => {
    expect(service).toBeTruthy();
  }));
});
