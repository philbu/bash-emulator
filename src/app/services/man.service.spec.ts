/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ManService } from './man.service';

describe('ManService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManService]
    });
  });

  it('should ...', inject([ManService], (service: ManService) => {
    expect(service).toBeTruthy();
  }));
});
