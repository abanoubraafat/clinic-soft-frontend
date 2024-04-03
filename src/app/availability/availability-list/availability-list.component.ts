import { CommonModule, NgFor } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { AvailabilityService } from '../../services/availability.service';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { SuccessComponent } from '../../success/success.component';
import { PageTitleComponent } from '../../page-title/page-title.component';

@Component({
  selector: 'app-availability-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule, NgFor, PaginationComponent, SpinnerComponent, SuccessComponent, 
    ConfirmComponent, RouterModule, PageTitleComponent],
  providers: [AvailabilityService],
  templateUrl: './availability-list.component.html',
  styleUrl: './availability-list.component.css'
})
export class AvailabilityListComponent {
  constructor(private service: AvailabilityService, private _router: Router) { }
  mylist: any;
  loading: boolean = false;
  currentPageItems!: any[];
  get displayedItems(): any[] {
    return this.currentPageItems || [];
  }

  onPageChange(pageItems: any[]): void {
    this.currentPageItems = pageItems;
  }
  ngOnInit(): void {
    this.loading = true;
    this.getlsit();
  }
  getlsit() {
    this.service.get_avil().subscribe(
      {
        next: (data) => {
          this.mylist = data; this.loading = false;
          this.currentPageItems = this.mylist.slice(0, 6);
        },
        error: (err) => { console.log(err); }
      }
    );
  }
  edita(id: any) {
    this._router.navigate(['updateavil/' + id])
  };
  ///
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
  deletea() {
    this.service.delete(this.toBeDeletedId).subscribe(
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

  //
  onDateChange(date: any) {
    this.service.month(date.target.value).subscribe(
      {
        next: (data) => {
          debugger
          console.log(data);
          this.mylist = data;
          this.currentPageItems = this.mylist.slice(0, 6);
        },
        error: (err) => { console.log(err); }
      }
    )
  }
}
