import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  providers: [UserService,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

myform=new FormGroup({email:new FormControl
("",Validators.required),password:new FormControl
  ("",Validators.required),
})
  constructor(private userService: UserService, private router: Router) { }

  login() {
  

    
    this.userService.loginUser(this.email, this.password)
      .subscribe(
        (response) => {
          console.log('Login Successful ');
           localStorage.setItem("user", response.type);
          // this.userService.res = response;
          this.userService.save();
          this.router.navigate(['/home']);
        },
        (error) => {
          this.errorMessage = 'Login failed. Please Try Again';
          console.error('Login Error:', error);
        }
      );
  }
}
