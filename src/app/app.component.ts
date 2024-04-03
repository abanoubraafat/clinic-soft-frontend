import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { PatientComponent } from './PatientComponent/patient/patient.component';
import { PatientListComponent } from './PatientComponent/patient-list/patient-list.component';
import { PatientDetailsComponent } from './PatientComponent/patient-details/patient-details.component';
import { PatientUpateComponent } from './PatientComponent/patient-upate/patient-upate.component';
import { OperationComponent } from './OperationComponent/operation/operation.component';
import { OperationListComponent } from './OperationComponent/operation-list/operation-list.component';
import { OperationUpdateComponent } from './OperationComponent/operation-update/operation-update.component';
import { CostsComponent } from './costs/costs.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet
    , NavbarComponent, FooterComponent
    ,PatientComponent,PatientListComponent,PatientDetailsComponent,PatientUpateComponent
    ,OperationComponent,OperationListComponent,OperationUpdateComponent,CostsComponent],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'clinicSoft';
  // showSidebar: boolean = false;
  // subcription: Subscription;
  constructor() {
    // this.subcription = this.sidebarService.showSidebar.subscribe((value) => {
    //   debugger
    //   this.showSidebar = value;
    // })
  }
  // ngOnInit(): void {
  //   debugger
  //   console.log("h")
  // }
  // ngOnChanges(changes: SimpleChanges): void {
  //   debugger
  //   console.log("h")
  // }
  // ngOnDestroy(): void {
  //   debugger
  //   this.subcription.unsubscribe();
  // }
}
