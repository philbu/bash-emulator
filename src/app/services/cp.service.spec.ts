/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CpService } from './cp.service';

describe('CpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CpService]
    });
  });

  it('should ...', inject([CpService], (service: CpService) => {
    expect(service).toBeTruthy();
  }));
});
