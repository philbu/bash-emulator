/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MvService } from './mv.service';

describe('MvService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MvService]
    });
  });

  it('should ...', inject([MvService], (service: MvService) => {
    expect(service).toBeTruthy();
  }));
});
