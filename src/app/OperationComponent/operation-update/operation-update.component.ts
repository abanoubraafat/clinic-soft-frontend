import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationService } from '../../services/operation.service';
import { HttpClientModule } from '@angular/common/http';
import { PatientServiceService } from '../../services/patient-service.service';
import { SuccessComponent } from '../../success/success.component';
import { PageTitleComponent } from '../../page-title/page-title.component';

@Component({
  selector: 'app-operation-update',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule, SuccessComponent, PageTitleComponent],
  providers:[OperationService,PatientServiceService],
  templateUrl: './operation-update.component.html',
  styleUrl: './operation-update.component.css'
})
export class OperationUpdateComponent {

  OperationData: any;
  submitted: boolean = false;
  dateError: boolean = false;
  typeError: boolean = false;
  patientIdError: boolean = false;
  patientIdExixtError: boolean = false;
  patients:any;

  //@Output() updatePatient: EventEmitter<any> = new EventEmitter();

 // submitted: boolean = false;
  operationId:any;

  constructor(private url:ActivatedRoute, private Service:OperationService, private PatientServ:PatientServiceService, private router:Router ) {
    this.operationId = url.snapshot.params['id']
    this.Service.getById(this.operationId).subscribe({
      next: (data:any) => {this.OperationData = data;console.log(this.OperationData) },
      error: (err:any) => {}
    })
  }
  ngOnInit(): void {
    this.PatientServ.getAll().subscribe({
      next: data=>this.patients=data
    })
  }

  newOperation: any = {

     Date: '',
     Type: '',
     PatientId: '',
 };

 onPatientidChange(e:any)
 {
   for (let index = 0; index < this.patients.length; index++) {
     let element = this.patients[index];
     if (e.target.value==element.patientId&&e.target.value!="") {
       this.patientIdExixtError=false;
       return;
     }
   }
   this.patientIdExixtError=true;
 }

isSaved:boolean = false
  onSubmit() {
    if (!this.OperationData.date) {
      this.dateError = true;
      return;
    } else {
      this.dateError = false;
    }
    const currentDate = new Date();
    const enteredDate = new Date(this.OperationData.date);
    if (enteredDate <= currentDate) {
      return;
    }

    if (!this.OperationData.type) {
      this.typeError = true;
      return;
    } else {
      this.typeError = false;
    }

    if (!this.OperationData.patientId) {
      this.patientIdError = true;
      return;
    } else {
      this.patientIdError = false;
    }
    if(this.patientIdExixtError)
    {
      return;
    }
    this.Service.update(this.OperationData, this.operationId).subscribe(
      {
        next: data => {
          this.isSaved = true
          setTimeout(()=> this.router.navigate(['operationlist']), 3000)
        },
        error: err => console.log(err)
      }
    )
  }
  dateInPast(): boolean {
    if (!this.OperationData.date) {
      return false;
    }
    const currentDate = new Date();
    const enteredDate = new Date(this.OperationData.date);
    return enteredDate <= currentDate;
  }


}
