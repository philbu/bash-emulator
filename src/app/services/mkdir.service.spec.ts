/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MkdirService } from './mkdir.service';

describe('MkdirService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MkdirService]
    });
  });

  it('should ...', inject([MkdirService], (service: MkdirService) => {
    expect(service).toBeTruthy();
  }));
});
