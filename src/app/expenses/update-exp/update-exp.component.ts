import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpensesService } from '../../services/expenses.service';
import { SuccessComponent } from '../../success/success.component';
import { PageTitleComponent } from '../../page-title/page-title.component';

@Component({
  selector: 'app-update-exp',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, CommonModule, SuccessComponent, PageTitleComponent],
  providers: [ExpensesService],
  templateUrl: './update-exp.component.html',
  styleUrl: './update-exp.component.css'
})
export class UpdateExpComponent {
  id: number;
  NewExpences: any;
  Updateform: FormGroup = new FormGroup({
    id: new FormControl(null),
    Electricity: new FormControl(null, [Validators.required]),
    Rent: new FormControl(null, [Validators.required]),
    Tools: new FormControl(null, [Validators.required]),
    Salaries: new FormControl(null, [Validators.required]),
    Others: new FormControl(null, [Validators.required]),
    Month: new FormControl(null, [Validators.required]),
  });
  constructor(private service: ExpensesService, private url: ActivatedRoute, private _router: Router) {
    this.id = this.url.snapshot.params['id'];
    service.getById(this.id).subscribe(
      {
        next: (data) => {
          this.NewExpences = data;
          this.Updateform = new FormGroup({
            id: new FormControl(this.id),
            Electricity: new FormControl(this.NewExpences.electricity, [Validators.required]),
            Rent: new FormControl(this.NewExpences.rent, [Validators.required]),
            Tools: new FormControl(this.NewExpences.tools, [Validators.required]),
            Salaries: new FormControl(this.NewExpences.salaries, [Validators.required]),
            Others: new FormControl(this.NewExpences.others, [Validators.required]),
            Month: new FormControl(this.NewExpences.month, [Validators.required]),
          });
        },
        error: (err) => console.log(err)
      }
    )
  };

  isSaved: boolean = false;
  submitForm(Updateform: FormGroup) {
    debugger
    console.log(Updateform.value)
    this.service.update(Updateform.value, this.id).subscribe((res) => {
      this.isSaved = true;
      setTimeout(() => this._router.navigate(['expensesList']), 1500)
    });
  };




}
