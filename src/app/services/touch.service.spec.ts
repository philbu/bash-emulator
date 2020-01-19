/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TouchService } from './touch.service';

describe('TouchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TouchService]
    });
  });

  it('should ...', inject([TouchService], (service: TouchService) => {
    expect(service).toBeTruthy();
  }));
});
