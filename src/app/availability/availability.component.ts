import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AvailabilityService } from '../services/availability.service';
import { UserService } from '../services/user.service';
import { SuccessComponent } from '../success/success.component';
import { PageTitleComponent } from '../page-title/page-title.component';
import { ErrorPopUpComponent } from '../error-pop-up/error-pop-up.component';

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule, SuccessComponent, PageTitleComponent, ErrorPopUpComponent],
  providers: [AvailabilityService, UserService],
  templateUrl: './availability.component.html',
  styleUrl: './availability.component.css'
})
export class AvailabilityComponent {
  Doctors: any[] = [];
  constructor(private service: AvailabilityService, private users: UserService, private _router: Router) { }
  isSaved: boolean = false;
  ngOnInit(): void {
    this.getdocs();
  }
  getdocs() {
    this.users.get_users().subscribe(
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
  };
  isAlreadySet= false
  submitForm(addform: FormGroup) {
    debugger
    this.service.getByday(this.addform.value.Month).subscribe({
      next: (res) => {
        if (res == null) {
          addform.value.FromTime = `${addform.value.FromTime}:00`;
          addform.value.ToTime = `${addform.value.ToTime}:00`;
          addform.value.Day = addform.value.Month;
          this.service.add(addform.value).subscribe((res) => {
            this.clearform();
            this.isSaved = true;
            setTimeout(() => this._router.navigate(['AvailabilityList']), 1500);
          });
        } else {
          this.isAlreadySet = true
          setTimeout(() => this.isAlreadySet = false, 3000);
        }
      },
      error: (err) => { console.log(err); }
    });
    // console.log(addform.value)
  };
  addform: FormGroup = new FormGroup({
    Month: new FormControl(null, [Validators.required]),
    Day: new FormControl(null),
    ToTime: new FormControl(null, [Validators.required]),
    FromTime: new FormControl(null, [Validators.required]),
    DoctorId: new FormControl(null, [Validators.required]),
  });
  //
  clearform() {
    this.addform = new FormGroup({
      Month: new FormControl(null, [Validators.required]),
      Day: new FormControl(null),
      ToTime: new FormControl(null, [Validators.required]),
      FromTime: new FormControl(null, [Validators.required]),
      DoctorId: new FormControl(null, [Validators.required]),
    });
  }
  invaledtime: boolean = false;
  ontotimecahne(eve: any) {
    if (eve.target.value <= this.addform.value.FromTime) {
      this.invaledtime = true;
    } else {
      this.invaledtime = false;
    }
  }

}
