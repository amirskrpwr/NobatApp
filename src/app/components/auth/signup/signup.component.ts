import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  private authStatusSub: Subscription;

  constructor(public authService: AuthService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (
      form.value.password1 < 8 ||
      (form.value.email !== 'admin@mail.com' &&
        form.value.password1 !== 'admin')
    ) {
      this.toastr.error(
        'کلمه عبور حداقل باید 8 کاراکتر باشد.',
        'کلمه عبور اشتباه است'
      );
      return;
    }
    if (form.value.password1 !== form.value.password2) {
      this.toastr.error(
        'کلمه های عبور با هم مطابقت ندارند',
        'کلمه عبور اشتباه است'
      );
      return;
    } else {
      this.isLoading = true;
      this.authService.createUser(form.value.email, form.value.password1);
    }
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
