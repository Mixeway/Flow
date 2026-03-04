import { TestBed } from '@angular/core/testing';

import { DataUpdateService } from './data-update.service';

describe('DataUpdateService', () => {
  let service: DataUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
