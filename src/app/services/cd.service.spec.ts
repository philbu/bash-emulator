/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CdService } from './cd.service';

describe('CdService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CdService]
    });
  });

  it('should ...', inject([CdService], (service: CdService) => {
    expect(service).toBeTruthy();
  }));
});
