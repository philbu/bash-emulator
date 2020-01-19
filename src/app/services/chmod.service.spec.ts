/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChmodService } from './chmod.service';

describe('ChmodService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChmodService]
    });
  });

  it('should ...', inject([ChmodService], (service: ChmodService) => {
    expect(service).toBeTruthy();
  }));
});
