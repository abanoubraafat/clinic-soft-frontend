import { Component } from '@angular/core';
import { ReceptionistService } from '../services/receptionist.service';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';
import { PageTitleComponent } from '../page-title/page-title.component';
import { SuccessComponent } from '../success/success.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-receptionist-edit',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, SpinnerComponent, PageTitleComponent, SuccessComponent,CommonModule],
  providers:[ReceptionistService, UserService],
  templateUrl: './receptionist-edit.component.html',
  styleUrl: './receptionist-edit.component.css'
})
export class ReceptionistEditComponent {
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
  receptionistId:any
  oldStartShift:any
  oldEndShift:any
  allReceptionists:any
  initFormControls(){
    this.fname = new FormControl(this.user.fname, [Validators.required, Validators.minLength(3), Validators.pattern("[A-Za-z]+")])
    this.lname= new FormControl(this.user.lname, [Validators.required, Validators.minLength(3), Validators.pattern("[A-Za-z]+")])
    this.email= new FormControl(this.receptionist.userEmail, [Validators.required, Validators.email])
    this.password= new FormControl(this.user.password, [Validators.required, Validators.minLength(3)])
    this.confirmPassword= new FormControl(this.user.password, [Validators.required, Validators.minLength(3)])
    this.nationalId = new FormControl(this.receptionist.userNational_Id, [Validators.required, this.validateNationalId])
    this.startWorkingDate= new FormControl(this.receptionist.startWorkingDate, [Validators.required])
    this.startShiftTime= new FormControl(this.receptionist.startShiftTime, [Validators.required])
    this.endShiftTime= new FormControl(this.receptionist.endShiftTime, [Validators.required])
    this.oldStartShift = this.receptionist.startShiftTime
    this.oldEndShift = this.receptionist.endShiftTime
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
  validateNationalId(control: any) {
    const value = parseInt(control.value); // Parsing the value to an integer
    
    // Check if value is provided, is a positive integer, and is exactly 14 digits long
    if (!isNaN(value) && value > 0 && value.toString().length === 14) {
      return null; // National ID is valid
    } else {
      return { invalidNationalId: true }; // National ID is either not a positive integer or not 14 characters long
    }
  }
  NationalIdExsistError:boolean = false
  onNationalidChange(e:any)
  {
    for (let index = 0; index < this.allReceptionists.length; index++) {
      if(this.receptionist.userNational_Id == this.allReceptionists[index].userNational_Id)
        continue;
      let element = this.allReceptionists[index];
      if (e.target.value==element.userNational_Id) {
        this.NationalIdExsistError=true;
        console.log("exist")
        return;
      }
    }
    this.NationalIdExsistError=false;
  }
//#endregion
loading:boolean = false
  constructor(private userService:UserService, private service:ReceptionistService, private url:ActivatedRoute, private router:Router) {
    this.loading = true
    this.receptionistId = url.snapshot.params['id']
    this.service.getAll().subscribe({
      next: data => {this.allReceptionists = data; console.log(data)}
    })
    this.service.getById(this.receptionistId).subscribe({
      next: data => {
        this.receptionist = data; 
        this.userService.getById(this.receptionist.userId).subscribe({
          next: data => {this.user = data; this.initFormControls(); this.createForm();this.loading=false;
            console.log(this.nationalId)
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
                if(this.email.value != '' && this.email.value != this.receptionist.userEmail)
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
          },
          error: err => console.log(err)
        })
      },
      error: err => console.log(err)
    })

    
  }
IsExistingEmail:any
updatedReceptionist:any
returned:any
isSaved:boolean = false
save(){
  this.user.fname = this.fname.value
  this.user.lname = this.lname.value
  this.user.email = this.email.value
  this.user.password = this.password.value
  //password:this.password.value, 
  this.user.type='R',
  this.user.nationalId = this.nationalId.value
  if(this.oldStartShift != this.startShiftTime.value)
    this.receptionist.startShiftTime = this.startShiftTime.value + ":00"
  if(this.oldEndShift != this.endShiftTime.value)
    this.receptionist.endShiftTime = this.endShiftTime.value + ":00"

  this.updatedReceptionist = {
    recepId: this.receptionistId,
    startShiftTime : this.receptionist.startShiftTime,
    endShiftTime : this.receptionist.endShiftTime,
    startWorkingDate: this.startWorkingDate.value,
    userId:this.user.userId
  }

  console.log(this.user)
  console.log(this.updatedReceptionist)
  this.userService.update(this.user, this.user.userId).subscribe({
    next: data => {
      this.service.update(this.updatedReceptionist, this.receptionistId).subscribe({
        next: data => {
                this.form.disable()
                this.isSaved = true
                setTimeout(()=> this.router.navigate(['receptionist-list']), 3000)
        },
        error: err => console.log(err)
      })
    },
    error: err => console.log(err)
  })
  
  }
}
