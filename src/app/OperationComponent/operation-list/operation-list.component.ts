import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OperationService } from '../../services/operation.service';
import {  HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../spinner/spinner.component';
import { PaginationComponent } from '../../pagination/pagination.component';
import { ConfirmComponent } from '../../confirm/confirm.component';
import { SuccessComponent } from '../../success/success.component';
import { PageTitleComponent } from '../../page-title/page-title.component';

@Component({
  selector: 'app-operation-list',
  standalone: true,
  imports: [FormsModule,HttpClientModule,RouterModule,SpinnerComponent,PaginationComponent,
             ConfirmComponent, CommonModule, SuccessComponent, PageTitleComponent],
  providers:[OperationService,DatePipe],
  templateUrl: './operation-list.component.html',
  styleUrl: './operation-list.component.css'
})
export class OperationListComponent implements OnInit {

  Operation:any;
  loading:boolean = false;
  isMouseOver = false
  constructor(private OpService:OperationService) {}

  currentPageItems!: any[];
  get displayedItems(): any[] {
    return this.currentPageItems || [];
  }

  onPageChange(pageItems: any[]): void {
    this.currentPageItems = pageItems;
  }

  ngOnInit(): void {
    this.loading=true;
    this.OpService.getAll().subscribe(
      {
        next: (data) => {this.Operation = data;this.loading=false
                         this.currentPageItems = this.Operation.slice(0, 6);
        },
        error: (err) => {}
      }
    )
 }
 showConfirmationDialog:boolean = false
  toBeDeletedOperationId:any
  showConfirmation(Operationid:any): void {
    this.showConfirmationDialog = true;
    this.toBeDeletedOperationId = Operationid
  }
  cancelDelete(): void {
    this.showConfirmationDialog = false;
  }
  isDeleted:boolean = false
 deleteOperation(){
  this.OpService.delete(this.toBeDeletedOperationId).subscribe(
    {
      next: (data) => {this.OpService.getAll().subscribe({next: (data) => {this.Operation = data;
        this.currentPageItems = this.Operation.slice(0, 6)
       }})
                      this.showConfirmationDialog = false
                      this.isDeleted = true
                      setTimeout(() => this.isDeleted = false, 3000)
                      },
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



onDateChange(date: any) {
  this.OpService.getByDay(date.target.value).subscribe(
    {
      next: (data) => {
        debugger
        console.log(data);
        this.Operation = data;
        this.currentPageItems = this.Operation.slice(0, 6);
      },
      error: (err) => { console.log(err); }
    }
  )
}

}

