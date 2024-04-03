import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ReservationService } from '../services/reservation.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination.component';
import { PageTitleComponent } from '../page-title/page-title.component';

@Component({
  selector: 'app-costs',
  standalone: true,
  imports: [FormsModule,HttpClientModule,RouterModule,SpinnerComponent,CommonModule,
             PaginationComponent, PageTitleComponent],
  providers:[ReservationService],
  templateUrl: './costs.component.html',
  styleUrl: './costs.component.css'
})
export class CostsComponent  {

  reservationsIncome: any[] = [];
  selectedDate: string = '';
  showByYear: boolean = false;
  selectedYear: number = 2022;

  currentPageItems!: any[];
  get displayedItems(): any[] {
    return this.currentPageItems || [];
  }

  onPageChange(pageItems: any[]): void {
    this.currentPageItems = pageItems;
  }

  constructor(private apiService: ReservationService) { }

  getIncomeByMonth() {
    this.apiService.getIncomeByMonth(this.selectedDate).subscribe((data: any) => {
      this.reservationsIncome = data;
      this.currentPageItems = this.reservationsIncome.slice(0, 6);
      this.showByYear = false;
    });
  }

  // getIncomeByYear() {
  //   const selectedYear = this.selectedYear;
  //   this.apiService.getIncomeByYear(selectedYear).subscribe((data: any) => {
  //     this.reservationsIncome = data;
  //     this.currentPageItems = this.reservationsIncome.slice(0, 6);
  //     this.showByYear = true;
  //   });


  // }
  getIncomeByYear() {
    const selectedYear = this.selectedYear;
    this.apiService.getIncomeByYear(selectedYear).subscribe((data: any) => {
      this.reservationsIncome = data;
      this.currentPageItems = this.reservationsIncome.slice(0, 6);
      this.showByYear = true;

      // Convert numbers to month names
      this.reservationsIncome.forEach((item) => {
        const date = new Date(item.date); // Assuming "date" is the field containing the income date
        const monthName = this.getMonthName(date.getMonth());
        item.monthName = monthName;
      });
    });
  }
  getMonthName(monthNumber: number): string {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    return months[monthNumber];
  }

  getIncomeByDay(date: string) {
    this.apiService.getIncomeByDay(date).subscribe((data: any) => {
      this.reservationsIncome = []
      this.reservationsIncome.push(data)
      this.currentPageItems = this.reservationsIncome.slice(0, 6);
      this.showByYear = false;
    });
  }

  // getIncomeAll(){
  //   this.apiService.getIncomeAllTime().subscribe({
  //     next: (data:any) => {
  //       this.reservationsIncome = data
  //       this.showByYear = false;
  //     }
  //   })
  // }

}
