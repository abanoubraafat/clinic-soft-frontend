import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  providers: [UserService],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLogin: boolean = false;
  isadmin: boolean = false;
  _subcription: Subscription;
  constructor(private service: UserService) {
    this._subcription = UserService.result.subscribe(() => {
      if (UserService.result.getValue() != null) {
        this.isLogin = true;
      } else {
        this.isLogin = false;
      }
      var isadmin = localStorage.getItem("user");
      if (isadmin == "admin") {
        this.isadmin = true;
      } else {
        this.isadmin = false;
      }
    });
  }
  calllogout() {
    this.service.logout();
  }
}
