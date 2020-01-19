/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { KillService } from './kill.service';

describe('KillService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KillService]
    });
  });

  it('should ...', inject([KillService], (service: KillService) => {
    expect(service).toBeTruthy();
  }));
});
