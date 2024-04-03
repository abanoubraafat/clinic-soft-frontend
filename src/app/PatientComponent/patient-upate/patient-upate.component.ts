import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PatientServiceService } from '../../services/patient-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SuccessComponent } from '../../success/success.component';
import { PageTitleComponent } from '../../page-title/page-title.component';

@Component({
  selector: 'app-patient-upate',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule, SuccessComponent, PageTitleComponent],
  providers:[PatientServiceService],
  templateUrl: './patient-upate.component.html',
  styleUrl: './patient-upate.component.css'
})
export class PatientUpateComponent {
   patientData: any; // Input for receiving patient data to be updated
  //@Output() updatePatient: EventEmitter<any> = new EventEmitter(); // EventEmitter for emitting updated patient data
  fNameError: boolean = false;
  lNameError: boolean = false;
  bloodTypeError: boolean = false;
  nationalIdError: boolean = false;
  submitted: boolean = false;
  patientId:any;
  NationalIdExsistError :boolean=false;
  patientNationalid:any;
  doubleError :boolean=false;
  containsNumbers(text: string): boolean {
    return /\d/.test(text);
  }

  constructor(private url:ActivatedRoute, private Service:PatientServiceService, private router:Router) {
    this.patientId = url.snapshot.params['id']
    this.Service.getAllInfobyId(this.patientId).subscribe({
      next: (data:any) => {this.patientData = data;console.log(this.patientData) },
      error: (err:any) => {}
    })
  }

  // Define the newPatient object to hold the updated patient data
  newPatient: any = {
    Patient_Id: '',
    Condition: '',
    Blood_Type: '',
    Medications: '',
    Notes: '',
    FName: '',
    LName: '',
    National_Id: ''
  };
  ngOnInit(): void {
    this.Service.getAll().subscribe({
      next: data=>this.patientNationalid=data
    })
  }
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
isSaved:boolean = false
  onSubmit() {

     if (this.patientData.fname.length < 3 || this.containsNumbers(this.patientData.fname)) {
      this.fNameError = true;
      return;
    } else {
      this.fNameError = false;
    }
    if (this.patientData.lname.length < 3 || this.containsNumbers(this.patientData.lname)) {
      this.lNameError = true;
      return;
    } else {
      this.lNameError = false;
    }
    // if (!this.patientData.bloodType) {
    //   this.bloodTypeError = true;
    //   return;
    // } else if (!/^[a-zA-Z]+$/.test(this.patientData.bloodType)) {
    //   this.bloodTypeError = true;
    //   return;
    // } else {
    //   this.bloodTypeError = false;
    // }
    // if (!this.patientData.nationalId) {
    //   this.nationalIdError = true;
    //   return;
    // } else {
    //   this.nationalIdError = false;
    // }
    if (!this.patientData.nationalId) {
      this.submitted = true;
      return;
    }
    const nationalIdLength = this.patientData.nationalId.toString().length;
    if (nationalIdLength !== 14) {

      this.submitted = true;
      return;
    }
    if (this.patientData.nationalId < 0) {
      return; // Prevent form submission
    }
    this.Service.update(this.patientData, this.patientId).subscribe(
      {
        next: data => {console.log(data)
                        this.isSaved = true
                        setTimeout(()=> this.router.navigate(['patientlist']), 3000)
        },
        error: err => console.log(err)
      }
    )
}
lengthError = false
  isInvalidLength() {
    const nationalIdLength = this.newPatient.NationalId.toString().length;
    this.lengthError = nationalIdLength !== 14;
  }
isDouble(): boolean {
  return this.newPatient.NationalId && this.newPatient.NationalId.toString().indexOf('.') !== -1;
}

}
