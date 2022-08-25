import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Appointment } from './Appointment.model';
import { environment } from 'src/environments/environment';
import { Time } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

const BACKEND_URL = environment.apiUrl + '/requests/';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  private requests: Appointment[] = [];
  private requestsUpdated = new Subject<{ requests: Appointment[] }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  getRequests() {
    this.http
      .get<{ requests: Appointment[] }>(BACKEND_URL)
      .subscribe((requestData) => {
        this.requests = requestData.requests;
        this.requestsUpdated.next({
          requests: [...this.requests],
        });
      });
  }

  getRequestUpdateListener() {
    return this.requestsUpdated.asObservable();
  }

  addRequest(
    name: string,
    phone_number: string,
    description: string,
    date: any,
    time: Time
  ) {
    const request: {
      name: string;
      phone_number: string;
      description: string;
      date: any;
      time: Time;
    } = {
      name: name,
      phone_number: phone_number,
      description: description,
      date: date,
      time: time,
    };

    this.http
      .post(BACKEND_URL, request, { responseType: 'text' })
      .subscribe((res) => {
        this.router.navigate(['/requests']);
        this.toastr.success('', 'درخواست ثبت شد');
      });
  }

  updateRequest(
    requestId: string,
    name: string,
    phone_number: string,
    description: string,
    date: any,
    time: Time
  ) {
    const updatedRequest: {
      name: string;
      phone_number: string;
      description: string;
      date: any;
      time: Time;
    } = {
      name: name,
      phone_number: phone_number,
      description: description,
      date: date,
      time: time,
    };
    this.http
      .put(BACKEND_URL + requestId, updatedRequest, { responseType: 'text' })
      .subscribe((response) => {
        this.router.navigate(['/requests']);
      });
  }

  updateRequestStatus(requestId: string, status: string) {
    const request_status: {
      status: string;
    } = {
      status: status,
    };
    return this.http.put(BACKEND_URL + 'status/' + requestId, request_status, {
      responseType: 'text',
    });
  }

  getRequest(id: string) {
    return this.http.get<Appointment>(BACKEND_URL + id);
  }

  deleteRequest(requestId: string) {
    return this.http.delete(BACKEND_URL + requestId, { responseType: 'text' });
  }
}
