import { Component, OnInit } from '@angular/core';
import { ReceptionistService } from '../services/receptionist.service';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { ConfirmComponent } from '../confirm/confirm.component';
import { CommonModule } from '@angular/common';
import { SuccessComponent } from '../success/success.component';
import { UserService } from '../services/user.service';
import { PageTitleComponent } from '../page-title/page-title.component';

@Component({
  selector: 'app-receptionist-list',
  standalone: true,
  imports: [HttpClientModule, RouterModule, SpinnerComponent, PaginationComponent, ConfirmComponent,
             CommonModule, SuccessComponent, PageTitleComponent],
  providers: [ReceptionistService, UserService],
  templateUrl: './receptionist-list.component.html',
  styleUrl: './receptionist-list.component.css'
})
export class ReceptionistListComponent implements OnInit {
  currentPageItems!: any[];

  get displayedItems(): any[] {
    return this.currentPageItems || [];
  }

  onPageChange(pageItems: any[]): void {
    this.currentPageItems = pageItems;
  }
  showConfirmationDialog:boolean = false
  toBeDeletedRecepId:any
  toBeDeletedUserId:any
  showConfirmation(receptionistId:any, userId:any): void {
    this.showConfirmationDialog = true;
    this.toBeDeletedRecepId = receptionistId
    this.toBeDeletedUserId = userId
  }
  cancelDelete(): void {
    this.showConfirmationDialog = false;
  }
  receptionists:any
  loading:boolean = false
  constructor(private service:ReceptionistService, private router:Router, private userService:UserService) {
  }
  getAllReceptionists(){
    this.service.getAll().subscribe(
      {
        next: data =>{ this.receptionists = data; this.loading = false;
          this.currentPageItems = this.receptionists.slice(0, 6);
        },
        error: err => console.log(err)
      }
    )
  }
  ngOnInit(): void {
    this.loading = true
    this.getAllReceptionists()
  }
  isDeleted:boolean = false
  deleteReceptionist(){
    this.service.delete(this.toBeDeletedRecepId).subscribe(
      {
        next: data => {this.getAllReceptionists(); 
          this.userService.delete(this.toBeDeletedUserId).subscribe(
            {
                next: data => {
                  this.showConfirmationDialog = false;
                  this.isDeleted = true
                  setTimeout(() => this.isDeleted = false, 3000)
                },
                error: err => console.log(err)
            }
          )
        
        },
        error: err => console.log(err)
      }
    )
  }
  editReceptionist(receptionistId:any){
    this.router.navigate(['receptionist-edit/'+receptionistId])
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

}
