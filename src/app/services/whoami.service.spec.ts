/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WhoamiService } from './whoami.service';

describe('WhoamiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WhoamiService]
    });
  });

  it('should ...', inject([WhoamiService], (service: WhoamiService) => {
    expect(service).toBeTruthy();
  }));
});
