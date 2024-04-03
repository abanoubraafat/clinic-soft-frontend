import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  constructor(private _HttpClient: HttpClient) { }
  private readonly context = `http://localhost:5178/api/Expense`;
  get_expenses(): Observable<any> {
    return this._HttpClient.get(`${this.context}/getAll`);
  }
  getById(id: number) {
    return this._HttpClient.get(this.context + "/" + id);
  }
  add(exp: any): Observable<any> {
    return this._HttpClient.post<any>(`${this.context}`, exp).pipe(
      catchError((error) => {
        console.error('Error adding expense:', error);
        return throwError('Something went wrong; please try again later.');
      })
    );
  }
  update(exp: any, id: number) {
    debugger
    return this._HttpClient.put(this.context + "/" + id, exp)
  }
  delete(id: number) {
    return this._HttpClient.delete(this.context + "/" + id)
  }
  getBymonth(date: any) {
    debugger
    return this._HttpClient.get(this.context + "/GetBymonth?date=" + date);
  }
}
