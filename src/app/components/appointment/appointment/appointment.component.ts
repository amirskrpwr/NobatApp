import { Time } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, timestamp } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { Appointment } from '../Appointment.model';
import { AppointmentsService } from '../appointments.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
})
export class AppointmentComponent implements OnInit, OnDestroy {
  isLoading = false;
  requests: Appointment[];
  userId: string;
  isAdmin: boolean;
  isAuthenticated: boolean;

  private authStatusSub: Subscription;
  private requestsSub: Subscription;

  constructor(
    public appointmentsService: AppointmentsService,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.isAdmin = this.authService.getIsAdmin();
    this.isAuthenticated = this.authService.getIsAuth();
    this.appointmentsService.getRequests();
    this.userId = this.authService.getUserId() as string;
    this.requestsSub = this.appointmentsService
      .getRequestUpdateListener()
      .subscribe((requestData: { requests: Appointment[] }) => {
        this.isLoading = false;
        if (!this.isAdmin) {
          this.requests = requestData.requests.filter(
            (req) => req.user_id == this.userId
          );
        } else {
          this.requests = requestData.requests;
        }
      });
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId() as string;
      });
  }

  onDelete(requestId: string) {
    this.appointmentsService.deleteRequest(requestId).subscribe(
      () => {
        this.appointmentsService.getRequests();
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onChangeRequestStaus(requestId: string, request_status: string) {
    this.appointmentsService
      .updateRequestStatus(requestId, request_status)
      .subscribe(
        (response) => {
          this.appointmentsService.getRequests();
          this.router.navigate(['/requests']);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  ngOnDestroy(): void {
    this.requestsSub?.unsubscribe();
    this.authStatusSub?.unsubscribe();
  }

  getPersianDate(date: Date) {
    return date
      .toString()
      .slice(0, 10)
      .replace('-', '/')
      .replace('-', '/')
      .replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
  }

  toFarsiTime(time: Time) {
    return time.toString().replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
  }
}
