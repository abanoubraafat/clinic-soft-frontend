import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PatientServiceService } from '../../services/patient-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule],providers:[PatientServiceService],
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.css'
})
export class PatientDetailsComponent implements OnInit {
  ID=0;
  Patientdetails:any;
  constructor(myActivate:ActivatedRoute,private PatientDetails:PatientServiceService)
  {
   this.ID= myActivate.snapshot.params["id"];
  }
  ngOnInit(): void {
    this.PatientDetails.getAllInfobyId(this.ID).subscribe({
      next: (data) => this.Patientdetails=data,

      error: (err) => {}

    });
  }


}
