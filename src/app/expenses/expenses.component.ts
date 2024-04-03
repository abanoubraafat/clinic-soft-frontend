import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpensesService } from '../services/expenses.service';
import { SuccessComponent } from '../success/success.component';
import { PageTitleComponent } from '../page-title/page-title.component';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule, SuccessComponent, PageTitleComponent],
  providers: [ExpensesService],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent {
  constructor(private _exp: ExpensesService, private _router: Router) { }
  isSaved: boolean = false;
  submitForm(addform: FormGroup) {
    this._exp.add(addform.value).subscribe((res) => {
      console.log(res);
      // alert("succsse");
      this.clearform();
      this.isSaved = true;
      setTimeout(() => this._router.navigate(['expensesList']), 1500)
    });
    // console.log(addform)
  }
  addform: FormGroup = new FormGroup({
    Electricity: new FormControl(null, [Validators.required, Validators.min(0)]),
    Rent: new FormControl(null, [Validators.required, Validators.min(0)]),
    Tools: new FormControl(null, [Validators.required, Validators.min(0)]),
    Salaries: new FormControl(null, [Validators.required, Validators.min(0)]),
    Others: new FormControl(null, [Validators.required, Validators.min(0)]),
    Month: new FormControl(null, [Validators.required, Validators.min(0)]),
  });
  clearform() {
    this.addform = new FormGroup({
      Electricity: new FormControl(null, [Validators.required, Validators.min(0)]),
      Rent: new FormControl(null, [Validators.required, Validators.min(0)]),
      Tools: new FormControl(null, [Validators.required, Validators.min(0)]),
      Salaries: new FormControl(null, [Validators.required, Validators.min(0)]),
      Others: new FormControl(null, [Validators.required, Validators.min(0)]),
      Month: new FormControl(null, [Validators.required, Validators.min(0)]),
    });
  }
}
