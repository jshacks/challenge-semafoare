/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SemafoareService } from './semafoare.service.ts';

describe('Service: Semafoare', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SemafoareService]
    });
  });

  it('should ...', inject([SemafoareService], (service: SemafoareService) => {
    expect(service).toBeTruthy();
  }));
});
