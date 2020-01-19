/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UnameService } from './uname.service';

describe('UnameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnameService]
    });
  });

  it('should ...', inject([UnameService], (service: UnameService) => {
    expect(service).toBeTruthy();
  }));
});
