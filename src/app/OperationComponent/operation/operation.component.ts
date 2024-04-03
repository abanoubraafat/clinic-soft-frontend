import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OperationService } from '../../services/operation.service';
import { PatientServiceService } from '../../services/patient-service.service';
import { SuccessComponent } from '../../success/success.component';
import { Router } from '@angular/router';
import { PageTitleComponent } from '../../page-title/page-title.component';

@Component({
  selector: 'app-operation',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule, SuccessComponent, PageTitleComponent],
  providers:[ OperationService,PatientServiceService],
  templateUrl: './operation.component.html',
  styleUrl: './operation.component.css'
})
export class OperationComponent implements OnInit{
  @Output() addOperation: EventEmitter<any> = new EventEmitter();
  submitted: boolean = false;
  dateError: boolean = false;
  typeError: boolean = false;
  patientIdError: boolean = false;
  patientIdExixtError: boolean = false;
  patients:any;


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
  constructor(private OperationSerivce: OperationService,private PatientServ :PatientServiceService, private router:Router) { }
  ngOnInit(): void {
    this.PatientServ.getAll().subscribe({
      next: data=>this.patients=data
    })
  }
  isSaved:boolean = false
  onSubmit() {

    if (!this.newOperation.Date) {
      this.dateError = true;
      return;
    } else {
      this.dateError = false;
    }

    const currentDate = new Date();
    const enteredDate = new Date(this.newOperation.Date);
    if (enteredDate <= currentDate) {
      return;
    }

    if (!this.newOperation.Type) {
      this.typeError = true;
      return;
    } else {
      this.typeError = false;
    }

    if (!this.newOperation.PatientId) {
      this.patientIdError = true;
      return;
    } else {
      this.patientIdError = false;
    }
    if(this.patientIdExixtError)
    {
      return;
    }

    this.OperationSerivce.addnewOperation(this.newOperation).subscribe(
      response => {

        this.addOperation.emit(this.newOperation);
        this.resetForm();
        this.isSaved = true
        setTimeout(()=> this.router.navigate(['operationlist']), 3000)
      },
      error => {
        console.error('Error adding operation:', error);

      }
    );
}
resetForm() {
  this.newOperation = {
    Date: '',
    Type: '',
    PatientId: '',
  };
  this.submitted = false;
}
dateInPast(): boolean {
  if (!this.newOperation.Date) {
    return false;
  }
  const currentDate = new Date();
  const enteredDate = new Date(this.newOperation.Date);
  return enteredDate <= currentDate;
}

}


