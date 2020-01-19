/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PwdService } from './pwd.service';

describe('PwdService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PwdService]
    });
  });

  it('should ...', inject([PwdService], (service: PwdService) => {
    expect(service).toBeTruthy();
  }));
});
