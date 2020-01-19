/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UptimeService } from './uptime.service';

describe('UptimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UptimeService]
    });
  });

  it('should ...', inject([UptimeService], (service: UptimeService) => {
    expect(service).toBeTruthy();
  }));
});
