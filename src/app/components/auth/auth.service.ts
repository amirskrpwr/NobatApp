import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthData } from './AuthData.module';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private isAdmin: boolean = false;
  private token: string;
  private userId: string | null;
  private tokenTimer: any;
  private userEmail: string | null;
  private authStatusListener = new Subject<boolean>();
  private adminStatusListener = new Subject<boolean>();
  private userEmailListener = new Subject<string | null>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    return this.http.post(BACKEND_URL + '/signup', authData).subscribe(
      () => {
        this.toastr.success('لطفا وارد شوید', 'ثبت‌نام با موفقیت انجام شد.');
        this.router.navigate(['/login']);
      },
      (err) => {
        this.authStatusListener.next(false);
        this.userEmailListener.next(null);
        this.toastr.error(err.error.message, 'ثبت‌نام انجام نشد');
      }
    );
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getIsAdmin() {
    return this.isAdmin;
  }

  getUserEmail() {
    return this.userEmail;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAdminStatusListener() {
    return this.adminStatusListener.asObservable();
  }

  getUserEmailListener() {
    return this.userEmailListener.asObservable();
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
        email: string;
        isAdmin: boolean;
      }>(BACKEND_URL + '/login', authData)
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.toastr.success('شما وارد شدید', 'ورود با موفقیت انجام شد.');
            this.setAuthTime(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.userId = response.userId;
            this.userEmail = response.email;
            this.userEmailListener.next(this.userEmail);
            this.isAdmin = response.isAdmin;
            this.adminStatusListener.next(this.isAdmin);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(
              token,
              expirationDate,
              this.userId as string,
              this.userEmail,
              this.isAdmin
            );
            this.router.navigate(['/']);
          }
        },
        (err) => {
          this.authStatusListener.next(false);
          this.adminStatusListener.next(false);
          this.toastr.error(
            err.error.message
              ? err.error.message
              : 'ایمیل یا کلمه عبور اشتباه است.',
            'ورود انجام نشد'
          );
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.isAdmin = authInformation.isAdmin;
      this.userEmail = authInformation.email;
      this.userId = authInformation.userId;
      this.setAuthTime(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.adminStatusListener.next(this.isAdmin);
      this.userEmailListener.next(this.userEmail);
    }
  }

  logout() {
    this.token = '';
    this.isAuthenticated = false;
    this.isAdmin = false;
    this.authStatusListener.next(false);
    this.userEmailListener.next(null);
    this.adminStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
    this.toastr.success('شما خارج شدید.', 'خروج با موفقیت انجام شد.');
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string,
    email: string,
    isAdmin: boolean
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('email', email);
    localStorage.setItem('isAdmin', isAdmin.toString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('isAdmin');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    const isAdmin = localStorage.getItem('isAdmin');

    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate as string),
      userId: userId,
      email: email,
      isAdmin: isAdmin == 'true',
    };
  }

  private setAuthTime(duration: number) {
    console.log('setting timer: ', duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
