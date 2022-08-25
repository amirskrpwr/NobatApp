import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { IDatepickerTheme } from 'ng-persian-datepicker';
import { AuthService } from '../../auth/auth.service';
import { Appointment } from '../Appointment.model';
import { AppointmentsService } from '../appointments.service';

@Component({
  selector: 'app-get-apointment',
  templateUrl: './get-apointment.component.html',
  styleUrls: ['./get-apointment.component.css'],
})
export class GetApointmentComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  dateValue = new FormControl();
  public formatedDate: string;
  private mode = 'create';
  private requestId: string | null;
  private request: Appointment;

  customTheme: Partial<IDatepickerTheme> = {
    selectedBackground: '#D68E3A',
    selectedText: '#FFFFFF',
    todayText: '#abcabc',
  };

  constructor(
    public appointmentsService: AppointmentsService,
    public route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) {}

  onSaveAppointment() {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      phone_number: new FormControl(null, {
        validators: [Validators.required],
      }),
      description: new FormControl(null, { validators: [Validators.required] }),
      date: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern(/^\d{4}\/\d{2}\/\d{2}$/),
        ],
      }),
      time: new FormControl(null, {
        validators: [Validators.required],
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('requestId')) {
        this.mode = 'edit';
        this.requestId = paramMap.get('requestId');
        this.isLoading = true;
        this.appointmentsService
          .getRequest(this.requestId as string)
          .subscribe((requestData) => {
            this.formatedDate = requestData.date
              .toString()
              .slice(0, 10)
              .replace('-', '/')
              .replace('-', '/');
            this.isLoading = false;
            this.request = {
              id: requestData.id,
              name: requestData.name,
              phone_number: requestData.phone_number,
              description: requestData.description,
              date: requestData.date,
              time: requestData.time,
              status: requestData.status,
              user_id: requestData.user_id,
            };
            this.form.setValue({
              name: this.request.name,
              phone_number: this.request.phone_number,
              description: this.request.description,
              date: this.formatedDate,
              time: this.request.time,
            });
          });
      } else {
        this.mode = 'create';
        this.requestId = null;
      }
    });
  }

  onSendRequest() {
    if (this.form.invalid) {
      return;
    }

    if (this.mode == 'create') {
      this.appointmentsService.addRequest(
        this.form.value.name,
        this.form.value.phone_number,
        this.form.value.description,
        this.form.value.date,
        this.form.value.time
      );
    } else {
      if (
        this.form.value.name === this.request.name &&
        this.form.value.phone_number === this.request.phone_number &&
        this.form.value.description === this.request.description &&
        this.form.value.date === this.formatedDate &&
        this.form.value.time === this.request.time
      ) {
        this.router.navigate(['/requests']);
      } else
        this.appointmentsService.updateRequest(
          this.requestId as string,
          this.form.value.name,
          this.form.value.phone_number,
          this.form.value.description,
          this.form.value.date,
          this.form.value.time
        );
    }

    this.form.reset();
  }
}
