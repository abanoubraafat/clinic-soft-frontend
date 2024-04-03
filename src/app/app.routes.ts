import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReceptionistComponent } from './receptionist/receptionist.component';
import { ReservationComponent } from './reservation/reservation.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { OperationComponent } from './OperationComponent/operation/operation.component';
import { PatientComponent } from './PatientComponent/patient/patient.component';
import { PatientListComponent } from './PatientComponent/patient-list/patient-list.component';
import { ReservationEditComponent } from './reservation-edit/reservation-edit.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { ExpensesListComponent } from './expenses-list/expenses-list.component';
import { PatientUpateComponent } from './PatientComponent/patient-upate/patient-upate.component';
import { OperationListComponent } from './OperationComponent/operation-list/operation-list.component';
import { OperationUpdateComponent } from './OperationComponent/operation-update/operation-update.component';
import { PatientDetailsComponent } from './PatientComponent/patient-details/patient-details.component';
import { LoginComponent } from './login/login.component';
import { UpdateExpComponent } from './expenses/update-exp/update-exp.component';
import { AvailabilityComponent } from './availability/availability.component';
import { AvailabilityListComponent } from './availability/availability-list/availability-list.component';
import { AvailabilityUpdateComponent } from './availability/availability-update/availability-update.component';
import { ReceptionistListComponent } from './receptionist-list/receptionist-list.component';
import { ReceptionistEditComponent } from './receptionist-edit/receptionist-edit.component';
import { authGardGuard } from './Gard/auth-gard.guard';
import { CostsComponent } from './costs/costs.component';
import { adminGuard } from './Gard/admin.guard';
import { NotfoundComponent } from './notfound/notfound.component';
export const routes: Routes = [

    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', canActivate: [authGardGuard], component: HomeComponent },
    { path: 'reservation', canActivate: [authGardGuard], component: ReservationComponent },
    { path: 'reservation-list', canActivate: [authGardGuard], component: ReservationListComponent },
    { path: 'reservation-edit/:id', canActivate: [authGardGuard], component: ReservationEditComponent },
    { path: 'operation', canActivate: [authGardGuard], component: OperationComponent },
    { path: 'operationlist', canActivate: [authGardGuard], component: OperationListComponent },
    { path: 'operationupdate/:id', canActivate: [authGardGuard], component: OperationUpdateComponent },
    { path: 'patient', canActivate: [authGardGuard], component: PatientComponent },
    { path: 'patientlist', canActivate: [authGardGuard], component: PatientListComponent },
    { path: 'patientupdate/:id', canActivate: [authGardGuard], component: PatientUpateComponent },
    { path: 'patient/:id', canActivate: [authGardGuard], component: PatientDetailsComponent },
    { path: 'receptionist', canActivate: [authGardGuard, adminGuard], component: ReceptionistComponent },
    { path: 'receptionist-list', canActivate: [authGardGuard, adminGuard], component: ReceptionistListComponent },
    { path: 'receptionist-edit/:id', canActivate: [authGardGuard, adminGuard], component: ReceptionistEditComponent },
    { path: 'expenses', canActivate: [authGardGuard, adminGuard], component: ExpensesComponent },
    { path: 'expensesList', canActivate: [authGardGuard, adminGuard], component: ExpensesListComponent },
    { path: 'Login', component: LoginComponent },
    { path: 'updateexp/:id', canActivate: [authGardGuard], component: UpdateExpComponent },
    { path: 'Availability', canActivate: [authGardGuard], component: AvailabilityComponent },
    { path: 'AvailabilityList', canActivate: [authGardGuard], component: AvailabilityListComponent },
    { path: 'updateavil/:id', canActivate: [authGardGuard], component: AvailabilityUpdateComponent },
    { path: 'updateavil/:id', canActivate: [authGardGuard], component: AvailabilityUpdateComponent },
    { path: 'costs', canActivate: [authGardGuard, adminGuard], component: CostsComponent },
    { path: '**', component: NotfoundComponent },


];
