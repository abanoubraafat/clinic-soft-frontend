import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isadmin: boolean = false;
  ngOnInit(): void {
    if (localStorage.getItem("user") == "admin") {
      this.isadmin = true;
    } else {
      this.isadmin = false;
    }
  }
}
