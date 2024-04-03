import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PatientServiceService } from '../../services/patient-service.service';
import { HttpClientModule } from '@angular/common/http';
import { SuccessComponent } from '../../success/success.component';
import { Router } from '@angular/router';
import { PageTitleComponent } from '../../page-title/page-title.component';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule, SuccessComponent, PageTitleComponent],
  providers:[ PatientServiceService],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent {

  @Output() addPatient: EventEmitter<any> = new EventEmitter();
  submitted: boolean = false;
  fNameError: boolean = false;
  lNameError: boolean = false;
  bloodTypeError: boolean = false;
  nationalIdError: boolean = false;
  NationalIdExsistError :boolean=false;
  containsNumbers(text: string): boolean {
    return /\d/.test(text);
  }
  doubleError :boolean=false;
  patientNationalid:any;
  newPatient: any = {
    Patient_Id: '',
    Condition: '',
    BloodType: '',
    Medications: '',
    Notes: '',
    FName: '',
    LName: '',
    NationalId: ''
  };
  onNationalidChange(e:any)
  {
    this.isInvalidLength() 

    if (this.isDouble()) {
      this.doubleError = true;
      return;
    }else
    {
      this.doubleError = false;
    }
    for (let index = 0; index < this.patientNationalid.length; index++) {
      let element = this.patientNationalid[index];
      if (e.target.value==element.nationalId) {
        this.NationalIdExsistError=true;
        return;
      }
    }
    this.NationalIdExsistError=false;
  }
  constructor(private patientService: PatientServiceService, private router:Router) { }
  ngOnInit(): void {
    this.patientService.getAll().subscribe({
      next: data=>this.patientNationalid=data
    })
  }
  isSaved:boolean = false
  onSubmit() {
    if (this.newPatient.FName.length < 3 || this.containsNumbers(this.newPatient.FName)) {
      this.fNameError = true;
      return;
    } else {
      this.fNameError = false;
    }

    if (this.newPatient.LName.length < 3 || this.containsNumbers(this.newPatient.LName)) {
      this.lNameError = true;
      return;
    } else {
      this.lNameError = false;
    }
//     if (!this.newPatient.BloodType) {
//   this.bloodTypeError = true;
//   return;
// } else if (!/^[a-zA-Z]+$/.test(this.newPatient.BloodType)) {
//   this.bloodTypeError = true;
//   return;
// } else {
//   this.bloodTypeError = false;
// }

if (!this.newPatient.NationalId) {
  this.submitted = true;
  return;
}
const nationalIdLength = this.newPatient.NationalId.toString().length;
if (nationalIdLength !== 14) {

  this.submitted = true;
  return;
}
if (this.newPatient.NationalId < 0) {
  return; // Prevent form submission
}

    this.patientService.addnewPatient(this.newPatient).subscribe(
      response => {
        this.addPatient.emit(this.newPatient);
        this.resetForm();
        this.isSaved = true
        setTimeout(()=> this.router.navigate(['patientlist']), 3000)
      },
      error => {
        console.error('Error adding patient:', error);

      }
    );
  }
lengthError = false
  isInvalidLength() {
    const nationalIdLength = this.newPatient.NationalId.toString().length;
    this.lengthError = nationalIdLength !== 14;
  }
  isDouble(): boolean {
    return this.newPatient.NationalId && this.newPatient.NationalId.toString().indexOf('.') !== -1;
}

  resetForm() {
    this.newPatient = {
      Patient_Id: '',
      Condition: '',
      BloodType: '',
      Medications: '',
      Notes: '',
      FName: '',
      LName: '',
      NationalId: ''
    };
    this.submitted = false;
  }

}
