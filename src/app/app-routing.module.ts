import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { GetApointmentComponent } from './components/appointment/get-apointment/get-apointment.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { AppointmentComponent } from './components/appointment/appointment/appointment.component';
import { AuthGuard } from './components/auth/auth.guard';
import { AdminGuard } from './components/auth/admin.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'appointment/create',
    component: GetApointmentComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'appointment/edit/:requestId',
    component: GetApointmentComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'requests',
    component: AppointmentComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  providers: [AuthGuard, AdminGuard],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
