import { CommonModule, NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConfirmComponent } from '../confirm/confirm.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { ExpensesService } from '../services/expenses.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { SuccessComponent } from '../success/success.component';
import { PageTitleComponent } from '../page-title/page-title.component';
@Component({
  selector: 'app-expenses-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule, NgFor, PaginationComponent, SpinnerComponent,
     ConfirmComponent, SuccessComponent, RouterModule, PageTitleComponent],
  providers: [ExpensesService],
  templateUrl: './expenses-list.component.html',
  styleUrl: './expenses-list.component.css'
})
export class ExpensesListComponent {
  myExpences: any;
  loading: boolean = false;
  currentPageItems!: any[];
  get displayedItems(): any[] {
    return this.currentPageItems || [];
  }

  onPageChange(pageItems: any[]): void {
    this.currentPageItems = pageItems;
  }
  constructor(private EXP: ExpensesService, private _router: Router) { }
  ngOnInit(): void {
    this.loading = true;
    this.getlsit();
  }
  getlsit() {
    this.EXP.get_expenses().subscribe(
      {
        next: (data) => {
          this.myExpences = data; this.loading = false;
          this.currentPageItems = this.myExpences.slice(0, 6);
        },
        error: (err) => { console.log(err); this.loading = false }
      }
    );
  }
  onDateChange(date: any) {
    this.EXP.getBymonth(date.target.value).subscribe(
      {
        next: (data) => {
          debugger
          console.log(data);
          this.myExpences = data;
          this.currentPageItems = this.myExpences.slice(0, 6);
        },
        error: (err) => { console.log(err); }
      }
    )
  }

  editEXP(id: any) {
    this._router.navigate(['updateexp/' + id])
  };

  showConfirmationDialog: boolean = false
  toBeDeletedId: any;
  showConfirmation(id: any): void {
    this.showConfirmationDialog = true;
    this.toBeDeletedId = id;
  }
  cancelDelete(): void {
    this.showConfirmationDialog = false;
  }
  isDeleted: boolean = false
  deleteexp() {
    this.EXP.delete(this.toBeDeletedId).subscribe(
      (res) => {
        this.getlsit();
        this.isDeleted = true
        setTimeout(() => this.isDeleted = false, 3000)
        this.showConfirmationDialog = false;
      },
      (error) => {
        console.error('An error occurred:', error);
        // You can handle the error here, such as showing an error message to the user
      }
    );
  };


};
