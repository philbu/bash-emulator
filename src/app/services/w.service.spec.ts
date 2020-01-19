/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WService } from './w.service';

describe('WService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WService]
    });
  });

  it('should ...', inject([WService], (service: WService) => {
    expect(service).toBeTruthy();
  }));
});
