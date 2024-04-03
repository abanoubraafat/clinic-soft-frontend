import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../services/reservation.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { PatientServiceService } from '../services/patient-service.service';
import { AvailabilityService } from '../services/availability.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { PageTitleComponent } from '../page-title/page-title.component';
import { SuccessComponent } from '../success/success.component';

@Component({
  selector: 'app-reservation-edit',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, SpinnerComponent, PageTitleComponent,
              CommonModule ,SuccessComponent],
  providers: [ReservationService, DatePipe, PatientServiceService, AvailabilityService],
  templateUrl: './reservation-edit.component.html',
  styleUrl: './reservation-edit.component.css'
})
export class ReservationEditComponent {
  reservationId:any
  reservation!:any
  patients:any
  today = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
  form:any 
  reservationPatient:any
  availability:any
  loading:boolean = true
  isOldDay = false
  constructor(private url:ActivatedRoute, private service:ReservationService, private datePipe:DatePipe, private patientService:PatientServiceService, private router:Router, private availabilityService: AvailabilityService) {  
    this.reservationId = url.snapshot.params['id']
    service.getById(this.reservationId).subscribe(
    {
      next: (data) => {
        this.reservation = data;
        this.form = new FormGroup({
          type: new FormControl(this.reservation.type, [Validators.required]),
          patient: new FormControl(this.reservation.patientName +" / " + this.reservation.patientId, [Validators.required]),
          cost : new FormControl(this.reservation.cost, [Validators.required, Validators.min(0)]),
          day : new FormControl(this.reservation.day, Validators.required)
        })
        this.form.controls['patient'].valueChanges.subscribe(
          {
            next: () => {
              if(this.form.controls['patient'].value != this.reservation.patientName || this.form.controls['day'].value != this.reservation.day)
                this.isAlreadyReserved()
            }
          }
        )
        this.getAvailability(this.form.controls['day'].value)
        this.getValidReservationForDrAvailability()
        this.form.controls['day'].valueChanges.subscribe(
          {
            next: (d:any) => {
              if(this.form.controls['day'].value != this.reservation.day || this.form.controls['patient'].value != this.reservation.patientName)
                  this.isAlreadyReserved()
              this.getAvailability(this.form.controls['day'].value)
              this.getValidReservationForDrAvailability()
              if(new Date() > new Date(this.form.controls['day'].value!.toString()) && this.form.controls['day'].value != this.reservation.day)
              this.isOldDay = true
            else
              this.isOldDay = false
            }
          }
        )
        this.form.controls['type'].valueChanges.subscribe({
          next: (d:any) => {
            this.getValidReservationForDrAvailability()
          }
        })
      },
      error: (err) => console.log(err)
    }
    )
    this.getAllPatients();
    
  }
  getAvailability(date:any){
    this.availabilityService.getByday(date).subscribe({
      next: data => {this.availability = data; console.log(this.loading); this.loading=false},
      error: err => console.log(err)
    })
  }
  getTypeValid(){
    return this.form?.controls["type"].valid
  }
  getPatientValid(){
    if(!this.form?.controls["patient"].valid)
      return false
    else{
      for (let i = 0; i < this.patients?.length; i++) {
        const element = this.patients[i];
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
  allDayReservations:any
  alreadyReserved = false
  isAlreadyReserved(){
  this.service.getByDay(this.form.controls['day'].value).subscribe(
        {
          next: data => {this.allDayReservations = data; 
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
  getCostValid(){
    return this.form?.controls["cost"].valid
  }
  getDayValid(){
    return this.form?.controls["day"].valid
  }
  
  getAllPatients(){
    this.patientService.getAll().subscribe(
      {
        next : (data) => this.patients = data,
        error : (err) => console.log(err)
      }
    )
  }
  isSaved:boolean = false
  save(){
    this.reservation.type = this.form.controls['type'].value
    this.reservation.cost = this.form.controls['cost'].value
    if( this.reservation.day != this.form.controls['day'].value)
    {
      this.reservation.fromTime = this.patientFromTime
      console.log("patient from" + this.patientFromTime)
      this.reservation.day = this.form.controls['day'].value
    }
    this.reservation.patientId = 0
    if(!this.form.valid || this.availability == null){
      
    }
    else
    {
      if(this.getPatientValid())
      {
        this.reservation.patientId = this.reservationPatient.patientId
        this.service.update(this.reservation,this.reservationId).subscribe(
        {
          next: (data) => {
            this.form.disable()
            this.isSaved = true
            setTimeout(()=> this.router.navigate(['reservation-list']), 3000)
          },
          error: (err) => {console.log(err)}
        })
      }
    }
      
    
  }
  redirectToAddPatient(){
    this.router.navigate(['/patient'])
  } 
  cancel(){
    this.router.navigate(['/reservation-list'])
  } 
  isValidReservationTimeForDr:any
  patientFromTime:any
  patientToTime:any
  lastReservation:any
getValidReservationForDrAvailability(){
  if(this.reservation.day != this.form.controls['day'].value)
  {
    this.service.IsValidLast(this.form.controls['day'].value).subscribe(
      {
        next: data => {this.isValidReservationTimeForDr = data
        if(this.isValidReservationTimeForDr)
        {
          this.service.getLastReservationOfTheDay(this.form.get("day")?.value).subscribe({
            next: data => {
              this.lastReservation = data
              if(this.isValidReservationTimeForDr)
            {
              if( this.reservation.day != this.form.controls['day'].value)
                {
                  if(this.lastReservation== null)
                  {
                    this.patientFromTime = this.availability.fromTime
                    if(this.form.get("type")?.value == "New")
                      this.patientToTime = this.addMinutesToTimeString(this.availability.fromTime, 15)
                    else if(this.form.get("type")?.value == "Consult")
                      this.patientToTime = this.addMinutesToTimeString(this.availability.fromTime, 10)
                  }
                  else{
                    this.patientFromTime = this.lastReservation.toTime
                    if(this.form.get("type")?.value == "New")
                      this.patientToTime = this.addMinutesToTimeString(this.lastReservation.toTime, 15)
                    else if(this.form.get("type")?.value == "Consult")
                      this.patientToTime = this.addMinutesToTimeString(this.lastReservation.toTime, 10)
                  }
                }
              else
              {
                if(this.reservation.type == this.form.controls['type'].value)
                {
                  this.patientFromTime = this.reservation.fromTime
                  this.patientToTime = this.reservation.toTime
                }
                else{
                  if(this.form.get("type")?.value == "New")
                      this.patientToTime = this.addMinutesToTimeString(this.reservation.fromTime, 15)
                    else if(this.form.get("type")?.value == "Consult")
                      this.patientToTime = this.addMinutesToTimeString(this.reservation.fromTime, 10)
                }
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
  else
    {this.isValidReservationTimeForDr = true
      this.patientFromTime = this.reservation.fromTime
      this.patientToTime = this.reservation.toTime
    }
}
addMinutesToTimeString(timeString: string, m:number): string {
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
