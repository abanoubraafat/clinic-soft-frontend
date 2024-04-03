import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AvailabilityService } from '../../services/availability.service';
import { UserService } from '../../services/user.service';
import { SuccessComponent } from '../../success/success.component';
import { PageTitleComponent } from '../../page-title/page-title.component';
@Component({
  selector: 'app-availability-update',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule, SuccessComponent, PageTitleComponent],
  providers: [AvailabilityService, UserService],
  templateUrl: './availability-update.component.html',
  styleUrl: './availability-update.component.css'
})
export class AvailabilityUpdateComponent {
  id: number;
  Doctors: any[] = [];
  NewExpences: any;
  Updateform: FormGroup = new FormGroup({
    id: new FormControl(null),
    Month: new FormControl(null, [Validators.required]),
    Day: new FormControl(null),
    FromTime: new FormControl(null, [Validators.required]),
    ToTime: new FormControl(null, [Validators.required]),
    DoctorId: new FormControl(null, [Validators.required]),
  });
  constructor(private service: AvailabilityService, private url: ActivatedRoute, private _router: Router, private _user: UserService) {
    this.id = this.url.snapshot.params['id'];
    service.getById(this.id).subscribe(
      {
        next: (data) => {
          this.NewExpences = data;
          this.Updateform = new FormGroup({
            id: new FormControl(this.id),
            Month: new FormControl(this.NewExpences.month, [Validators.required]),
            Day: new FormControl(null),
            FromTime: new FormControl(this.NewExpences.fromTime, [Validators.required]),
            ToTime: new FormControl(this.NewExpences.toTime, [Validators.required]),
            DoctorId: new FormControl(null, [Validators.required])
          });
          this._user.get_users().subscribe(
            {
              next: (data) => {
                let adminDoctors: any[] = [];
                data.forEach((element: any) => {
                  if (element.type === "admin") {
                    adminDoctors.push(element);
                  }
                });
                this.Doctors = adminDoctors;
              },
              error: (err) => { console.log(err); }
            }
          );
        },
        error: (err) => console.log(err)
      }
    )
  };
  isSaved = false
  submitForm(Updateform: FormGroup) {
    Updateform.value.FromTime = `${Updateform.value.FromTime}:00`;
    Updateform.value.ToTime = `${Updateform.value.ToTime}:00`;
    Updateform.value.Day = Updateform.value.Month;
    console.log(Updateform.value)
    this.service.update(Updateform.value, this.id).subscribe((res) => {
      console.log(res);
      this.isSaved = true
      setTimeout(() => {
        this._router.navigate(['/AvailabilityList'])
      }, 1500);
    });
  }
  invaledtime: boolean = false;
  ontotimecahne(eve: any) {
    if (eve.target.value <= this.Updateform.value.FromTime) {
      this.invaledtime = true;
    } else {
      this.invaledtime = false;
    }
  }
}
