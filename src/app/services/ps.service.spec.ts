/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PsService } from './ps.service';

describe('PsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PsService]
    });
  });

  it('should ...', inject([PsService], (service: PsService) => {
    expect(service).toBeTruthy();
  }));
});
