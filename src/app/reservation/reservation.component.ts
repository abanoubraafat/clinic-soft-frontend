import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../services/reservation.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { max } from 'rxjs';
import { Router } from '@angular/router';
import { PatientServiceService } from '../services/patient-service.service';
import { AvailabilityService } from '../services/availability.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { SuccessComponent } from '../success/success.component';
import { PageTitleComponent } from '../page-title/page-title.component';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, SpinnerComponent, SuccessComponent, CommonModule, PageTitleComponent],
  providers: [ReservationService, DatePipe, PatientServiceService, AvailabilityService],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent implements OnInit {
  today = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
  form = new FormGroup({
    type: new FormControl("", [Validators.required]),
    patient: new FormControl(null, [Validators.required]),
    cost: new FormControl(null, [Validators.required, Validators.min(0)]),
    day: new FormControl(this.today, Validators.required)
  })
  reservation: any
  patients: any
  reservationPatient: any
  availability: any
  loading: boolean = true
  isOldDay: boolean = false
  constructor(private service: ReservationService, private datePipe: DatePipe, private router: Router, private patientService: PatientServiceService, private availabilityService: AvailabilityService) { }
  ngOnInit(): void {
    this.getAllPatients();
    this.getAvailability(this.form.controls['day'].value)
    this.getValidReservationForDrAvailability()
    this.form.controls['patient'].valueChanges.subscribe(
      {
        next: (p) => {
          this.isAlreadyReserved()
        }
      }
    )
    this.form.controls['day'].valueChanges.subscribe(
      {
        next: (d) => {
          this.isAlreadyReserved()
          this.getAvailability(this.form.controls['day'].value)
          this.getValidReservationForDrAvailability()
          if (new Date() > new Date(this.form.controls['day'].value!.toString()))
            this.isOldDay = true
          else
            this.isOldDay = false    
        }
      }
    )
    this.form.controls['type'].valueChanges.subscribe({
      next: (d) => {
        this.getValidReservationForDrAvailability()
      }
    })
  }
  allDayReservations:any
  alreadyReserved = false
  isAlreadyReserved(){
  this.service.getByDay(this.form.controls['day'].value).subscribe(
        {
          next: data => {this.allDayReservations = data; 
            console.log(data)
            for (let i = 0; i < this.allDayReservations.length; i++) {
              let element = this.allDayReservations[i];
              let str = this.form.controls['patient'].value ?? ''
              let strWithoutSpaces = str.replace(/\s/g, '')
              if(strWithoutSpaces == this.allDayReservations[i].patientName.replace(/\s/g, '')+"/"+this.allDayReservations[i].patientId)
                {this.alreadyReserved = true
                  return;
                }
            }
            this.alreadyReserved = false
          },
          error: err => console.log(err)
        }
      )           
  }
  getAvailability(date: any) {
    this.availabilityService.getByday(date).subscribe({
      next: data => { this.availability = data; console.log(this.availability); this.loading = false },
      error: err => console.log(err)
    })
  }
  getTypeValid() {
    return this.form.controls["type"].valid
  }
  getPatientValid() {
    if (!this.form.controls["patient"].valid)
      return false
    else {
      for (let i = 0; i < this.patients.length; i++) {
        let element = this.patients[i];
        let str = this.form.controls['patient'].value ?? ''
        let strWithoutSpaces = str.replace(/\s/g, '')
        if(strWithoutSpaces == this.patients[i].fname+this.patients[i].lname +"/"+this.patients[i].patientId)
        {
          this.reservationPatient = element
          return true
        }
      }
      return false
    }
  }
  getCostValid() {
    return this.form.controls["cost"].valid
  }
  getDayValid() {
    return this.form.controls["day"].valid
  }

  getAllPatients() {
    this.patientService.getAll().subscribe(
      {
        next: (data) => { this.patients = data },
        error: (err) => console.log(err)
      }
    )
  }
  isValidReservationTimeForDr: any
  patientFromTime: any
  patientToTime: any
  lastReservation: any
  getValidReservationForDrAvailability() {
    this.service.IsValidLast(this.form.controls['day'].value).subscribe(
      {
        next: data => {
          this.isValidReservationTimeForDr = data
          console.log(this.isValidReservationTimeForDr)
          if (this.isValidReservationTimeForDr) {
            this.service.getLastReservationOfTheDay(this.form.get("day")?.value).subscribe({
              next: data => {
                this.lastReservation = data
                if (this.isValidReservationTimeForDr) {
                  if (this.lastReservation == null) {
                    this.patientFromTime = this.availability.fromTime
                    if (this.form.get("type")?.value == "New")
                      this.patientToTime = this.addMinutesToTimeString(this.availability.fromTime, 15)
                    else if (this.form.get("type")?.value == "Consult")
                      this.patientToTime = this.addMinutesToTimeString(this.availability.fromTime, 10)
                  }
                  else {
                    this.patientFromTime = this.lastReservation.toTime
                    if (this.form.get("type")?.value == "New")
                      this.patientToTime = this.addMinutesToTimeString(this.lastReservation.toTime, 15)
                    else if (this.form.get("type")?.value == "Consult")
                      this.patientToTime = this.addMinutesToTimeString(this.lastReservation.toTime, 10)
                  }

                }
              },
              error: err => console.log(err)
            })
          }
        },
        error: err => console.log(err)
      }
    )
  }
  isSaved: boolean = false
  save() {
    this.reservation = { type: this.form.get("type")?.value, cost: this.form.get("cost")?.value, day: this.form.get("day")?.value, patientId: 0 }
    console.log(this.reservation)
    if (!this.form.valid || this.availability == null) {

    }
    else {
      if (this.getPatientValid()) {
        this.reservation.patientId = this.reservationPatient.patientId
        this.service.add(this.reservation).subscribe(
          {
            next: (data) => {
              this.form.disable()
              this.isSaved = true
              setTimeout(() => this.router.navigate(['reservation-list']), 3000)
            },
            error: (err) => { console.log(err) }
          })
      }
    }


  }
  redirectToAddPatient() {
    this.router.navigate(['/patient'])
  }
  cancel() {
    this.router.navigate(['/reservation-list'])
  }

  addMinutesToTimeString(timeString: string, m: number): string {
    // Convert the time string to a Date object
    const timeParts = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(timeParts[0]);
    date.setMinutes(timeParts[1]);
    date.setSeconds(timeParts[2]);

    // Add 15 minutes
    date.setTime(date.getTime() + m * 60 * 1000);

    // Format the result back to a string
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }
}
