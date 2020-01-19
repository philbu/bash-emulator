/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HeadService } from './head.service';

describe('HeadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeadService]
    });
  });

  it('should ...', inject([HeadService], (service: HeadService) => {
    expect(service).toBeTruthy();
  }));
});
