import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-pop-up',
  standalone: true,
  imports: [],
  templateUrl: './error-pop-up.component.html',
  styleUrl: './error-pop-up.component.css'
})
export class ErrorPopUpComponent {
  @Input() title:any
  @Input() status:any
}
