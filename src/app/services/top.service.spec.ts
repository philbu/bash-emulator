/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TopService } from './top.service';

describe('TopService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TopService]
    });
  });

  it('should ...', inject([TopService], (service: TopService) => {
    expect(service).toBeTruthy();
  }));
});
