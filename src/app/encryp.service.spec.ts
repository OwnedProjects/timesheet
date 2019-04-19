import { TestBed } from '@angular/core/testing';

import { EncrypService } from './encryp.service';

describe('EncrypService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EncrypService = TestBed.get(EncrypService);
    expect(service).toBeTruthy();
  });
});
