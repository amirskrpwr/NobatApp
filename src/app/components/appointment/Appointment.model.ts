import { Time } from '@angular/common';

export interface Appointment {
  id: string;
  name: string;
  phone_number: string;
  description: string;
  date: Date;
  time: Time;
  status: string;
  user_id: string;
}
