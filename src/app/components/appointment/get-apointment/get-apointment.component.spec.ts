import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetApointmentComponent } from './get-apointment.component';

describe('GetApointmentComponent', () => {
  let component: GetApointmentComponent;
  let fixture: ComponentFixture<GetApointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetApointmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetApointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
