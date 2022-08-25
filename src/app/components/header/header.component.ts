import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean = false;
  private authListenerSub: Subscription;
  private adminListenerSub: Subscription;
  private userEmailSub: Subscription;
  isAdmin: boolean;
  userEmail: string | null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userEmail = this.authService.getUserEmail();
    this.isAdmin = this.authService.getIsAdmin();
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.authListenerSub = this.authService
      .getAdminStatusListener()
      .subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
      });
    this.userEmailSub = this.authService
      .getUserEmailListener()
      .subscribe((userEmail) => {
        this.userEmail = userEmail;
      });
    console.log('is admin: ', this.isAdmin);
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
    this.userEmailSub.unsubscribe();
    this.adminListenerSub.unsubscribe();
  }
}
