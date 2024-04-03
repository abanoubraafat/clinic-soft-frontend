import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PatientServiceService } from '../../services/patient-service.service';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { SuccessComponent } from '../../success/success.component';
import { PageTitleComponent } from '../../page-title/page-title.component';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [FormsModule,HttpClientModule,RouterModule , SpinnerComponent, PaginationComponent,
             CommonModule, ConfirmComponent, SuccessComponent, PageTitleComponent],
  providers:[PatientServiceService],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css'
})
export class PatientListComponent implements OnInit {
 Patient:any;
 loading:boolean = false;
 isMouseOver = false
 searchByName: string = '';

 searchByNationalId:string='';
 currentPageItems!: any[];
 get displayedItems(): any[] {
  return this.currentPageItems || [];
}

onPageChange(pageItems: any[]): void {
  this.currentPageItems = pageItems;
}
  constructor(private Service:PatientServiceService) {}
  ngOnInit(): void {
    this.loading=true;
    this.Service.getAll().subscribe(

      {
        next: (data) => {this.Patient = data;this.loading=false
                        this.currentPageItems = this.Patient.slice(0, 6);
        },
        error: (err) => {}
      }
    )

  }
  fetchPatients() {
    this.Service.getAll().subscribe({
      next: (data) => {
       this.Patient = data;this.loading = false;
       this.currentPageItems = this.Patient.slice(0, 6);
      },
      error: (err) => {
        console.error(err);

      }
    });
  }
  showConfirmationDialog:boolean = false
  toBeDeletedPatientId:any
  showConfirmation(patientId:any): void {
    this.showConfirmationDialog = true;
    this.toBeDeletedPatientId = patientId
  }
  cancelDelete(): void {
    this.showConfirmationDialog = false;
  }
  isDeleted: boolean = false
  deletePatient(){
    this.Service.delete(this.toBeDeletedPatientId).subscribe(
      {
        next: (data) => {this.Service.getAllInfo().subscribe({next: (data) => {this.Patient = data
                          this.currentPageItems = this.Patient.slice(0, 6);
                          this.showConfirmationDialog = false
                          this.isDeleted = true
                          setTimeout(() => this.isDeleted = false, 3000)
        } } )},
        error: (err) => {console.log(err); this.loading = false}
      })

  }
  changeColorDelete(e:any){
    e.target.style.color = "red"
  }
  changeColorEdit(e:any){
    e.target.style.color = "blue"
  }
  returnColor(e:any){
    e.target.style.color = "black"
  }

  searchPatients() {
    if (!this.searchByName.trim()) {
      this.fetchPatients();
      return;
    }
    this.Service.getAll().subscribe({
      next: (data) => {
       this.Patient = data;this.loading = false;
       this.Patient = this.Patient.filter((patient: any) =>
      (patient.fname.toLowerCase() + ' ' + patient.lname.toLowerCase()).includes(this.searchByName.toLowerCase())
    );
    this.currentPageItems = this.Patient.slice(0, 6);
      },
      error: (err) => {
        console.error(err);

      }
    });

  }
  searchPatientsByNationalId() {
    // Filter patients based on National ID search criteria
    if (!this.searchByNationalId.trim()) {
      // If searchByNationalId is empty, reset the patient list
      this.fetchPatients();
      return;
    }
    this.Service.getAll().subscribe({
      next: (data) => {
       this.Patient = data;this.loading = false;
       const regex = new RegExp(this.searchByNationalId.trim(), 'i');
       this.Patient = this.Patient.filter((patient: any) => regex.test(patient.nationalId));
       this.currentPageItems = this.Patient.slice(0, 6);
      },
      error: (err) => {
        console.error(err);

      }
    });
    // Create a regular expression to match any part of the National ID containing the entered characters

  }
}

