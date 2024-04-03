import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../services/reservation.service';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../spinner/spinner.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { ConfirmComponent } from '../confirm/confirm.component';
import { SuccessComponent } from '../success/success.component';
import { PageTitleComponent } from '../page-title/page-title.component';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [HttpClientModule, RouterModule, CommonModule, FormsModule, SpinnerComponent,
             PaginationComponent, ConfirmComponent, SuccessComponent, PageTitleComponent],
  providers:[ReservationService, DatePipe],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.css'
})
export class ReservationListComponent implements OnInit {
  reservations:any;
  loading:boolean = false;
  currentDate = Date.now.toString()
  today = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
  isMouseOver = false
  type = "--Select Type--"
  currentPageItems!: any[];
  displayedReservationWord:string = "Reservations"
  get displayedItems(): any[] {
    return this.currentPageItems || [];
  }

  onPageChange(pageItems: any[]): void {
    this.currentPageItems = pageItems;
  }
  constructor(private service:ReservationService, private datePipe:DatePipe, private router:Router) {
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
  }
  ngOnInit(): void {
    this.loading = true
    this.getAllReservations()
  }
  getAllReservations(){
    this.service.getByDay(this.today).subscribe(
      {
            next: (data) => {this.reservations = data; this.loading = false;
                             this.currentPageItems = this.reservations.slice(0, 6);
            },
            error: (err) => {console.log(err); this.loading = false}
      }
    )
  }
  getReservationByDay(date:any = this.currentDate){
    this.service.getByDay(date).subscribe(
      {
        next: (data) => {this.reservations = data; this.loading = false;
          this.currentPageItems = this.reservations.slice(0, 6);
        },
        error: (err) => {console.log(err); this.loading = false}
      }
    )
  }
  filterByType(e:any){
    if(e.target.value ==  "--Select Type--")
    {
      this.displayedReservationWord = "Reservations"
      this.getReservationByDay()
    }
    else{
      this.service.getByDay(this.currentDate).subscribe(
        {
          next: (data) => {this.reservations = data; this.loading = false;
            let tempRes:any[] = []
            for (let i = 0; i < this.reservations.length; i++) {
              if(this.reservations[i].type == e.target.value)
                tempRes.push(this.reservations[i])
            }
            this.reservations = tempRes
            this.displayedReservationWord = e.target.value + " Reservations"
            this.currentPageItems = this.reservations.slice(0, 6);
          },
          error: (err) => {console.log(err); this.loading = false}
        }
      )
    }
    

  }
  showConfirmationDialog:boolean = false
  toBeDeletedReservationId:any
  showConfirmation(receptionistId:any): void {
    this.showConfirmationDialog = true;
    this.toBeDeletedReservationId = receptionistId
  }
  cancelDelete(): void {
    this.showConfirmationDialog = false;
  }
  isDeleted:boolean = false
  deleteReservation(){
    this.service.delete(this.toBeDeletedReservationId).subscribe(
      {
        next: (data) => {this.getReservationByDay(this.currentDate)
                          this.isDeleted = true
                          setTimeout(()=> this.isDeleted = false ,3000)
        },
        error: (err) => {console.log(err); this.loading = false}
      })
    this.showConfirmationDialog = false
  }
  editReservation(reservationId:any){
    this.router.navigate(['reservation-edit/'+reservationId])
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
  changeReservationDay(e:any){
    this.type = "--Select Type--"
    if(e.target.value == "")
    {
      this.getReservationByDay(this.datePipe.transform(new Date(), 'yyyy-MM-dd')!)
      this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    }
    else{
        this.currentDate = this.datePipe.transform(e.target.value, 'yyyy-MM-dd')!;
        this.getReservationByDay(this.currentDate)
    }

  }
}
