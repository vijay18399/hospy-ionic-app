import { TestBed } from '@angular/core/testing';

import { SizerService } from './sizer.service';

describe('SizerService', () => {
  let service: SizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
