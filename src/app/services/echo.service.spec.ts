/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EchoService } from './echo.service';

describe('EchoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EchoService]
    });
  });

  it('should ...', inject([EchoService], (service: EchoService) => {
    expect(service).toBeTruthy();
  }));
});
