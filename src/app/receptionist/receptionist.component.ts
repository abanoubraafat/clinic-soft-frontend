import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { ReceptionistService } from '../services/receptionist.service';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SuccessComponent } from '../success/success.component';
import { PageTitleComponent } from '../page-title/page-title.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-receptionist',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, SuccessComponent, PageTitleComponent, CommonModule],
  providers: [UserService, ReceptionistService],
  templateUrl: './receptionist.component.html',
  styleUrl: './receptionist.component.css'
})
export class ReceptionistComponent {
  receptionist:any
  user:any
  //#region Form Declartion & Methods
  form!: FormGroup
  fname!:FormControl
  lname!:FormControl
  email!:FormControl
  password!:FormControl
  confirmPassword!:FormControl
  nationalId!:FormControl
  startWorkingDate!: FormControl;
  startShiftTime!:FormControl
  endShiftTime!:FormControl
  isEqualPass: boolean = true
  isValidShiftEnd: boolean = true
  allReceptionists:any
  initFormControls(){
    this.fname = new FormControl("", [Validators.required, Validators.minLength(3), Validators.pattern("[A-Za-z]+")])
    this.lname= new FormControl("", [Validators.required, Validators.minLength(3), Validators.pattern("[A-Za-z]+")])
    this.email= new FormControl("", [Validators.required, Validators.email])
    this.password= new FormControl("", [Validators.required, Validators.minLength(3)])
    this.confirmPassword= new FormControl("", [Validators.required, Validators.minLength(3)])
    this.nationalId = new FormControl("", [Validators.required, this.validateNationalId])
    this.startWorkingDate= new FormControl("", [Validators.required])
    this.startShiftTime= new FormControl("", [Validators.required])
    this.endShiftTime= new FormControl("", [Validators.required])
  }
  validateNationalId(control: any) {
    const value = parseInt(control.value); // Parsing the value to an integer
    
    // Check if value is provided, is a positive integer, and is exactly 14 digits long
    if (!isNaN(value) && value > 0 && value.toString().length === 14) {
      return null; // National ID is valid
    } else {
      return { invalidNationalId: true }; // National ID is either not a positive integer or not 14 characters long
    }
  }
  createForm(){
    this.form = new FormGroup({
      fname: this.fname,
      lname: this.lname,
      email:this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      nationalId: this.nationalId,
      startWorkingDate: this.startWorkingDate,
      startShiftTime : this.startShiftTime,
      endShiftTime : this.endShiftTime
    })
  }
//#endregion
  constructor(private userService:UserService, private service:ReceptionistService, private router:Router) {
    this.service.getAll().subscribe({
      next: data => {this.allReceptionists = data; console.log(data)}
    })
    this.initFormControls()
    this.createForm()
    this.form.valueChanges.subscribe(
      {
        next : (f) => {
          if(f.password != f.confirmPassword)
            this.isEqualPass = false;
           else
            this.isEqualPass=true
          if(f.startShiftTime >= f.endShiftTime)
            this.isValidShiftEnd = false
          else
            this.isValidShiftEnd = true
          }
      }
    )
    this.email.valueChanges.subscribe({
      next: (e) => {
        if(this.email.value != '')
        {
          this.userService.IsExistingEmail(this.email.value).subscribe(
            {
              next: data => {this.IsExistingEmail = data; console.log(e.value)},
              error: err => console.log(err)
            }
          )
        }
      }
    })
  }
  NationalIdExsistError:boolean = false
  onNationalidChange(e:any)
  {
    for (let index = 0; index < this.allReceptionists.length; index++) {
      let element = this.allReceptionists[index];
      if (e.target.value==element.userNational_Id) {
        this.NationalIdExsistError=true;
        console.log("exist")
        return;
      }
    }
    this.NationalIdExsistError=false;
  }

IsExistingEmail:any

returned:any
isSaved:boolean = false
save(){
  this.user = {
      fname:this.fname.value,
      lname:this.lname.value, 
      email:this.email.value, 
      password:this.password.value, 
      type:'R', 
      nationalId: this.nationalId.value}
  this.receptionist = {
    startShiftTime: this.startShiftTime.value + ":00",
    endShiftTime: this.endShiftTime.value + ":00",
    startWorkingDate: this.startWorkingDate.value,
    userId:0
  }
     this.userService.add(this.user).subscribe(
      {
        next: data => 
        {
          this.returned = data;
           this.receptionist.userId = this.returned.result.userId
           console.log(this.receptionist)
          this.service.add(this.receptionist).subscribe(
            {
              next: data => {
                this.form.disable()
                this.isSaved = true
                setTimeout(()=> this.router.navigate(['receptionist-list']), 3000)
              },
              error: err => console.log(err)
            }
          )
        },
        error: err => console.log(err)
      }
    )
  }
}
