import { TestBed } from '@angular/core/testing';

import { AppointmentsService } from './appointments.service';

describe('AppointmentService', () => {
  let service: AppointmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
