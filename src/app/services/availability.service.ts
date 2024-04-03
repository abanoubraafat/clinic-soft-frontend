import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  constructor(private _http: HttpClient) { }
  private readonly context = `http://localhost:5178/api/Availability`;
  add(avil: any) {
    debugger
    return this._http.post(`${this.context}`, avil);
  }
  get_avil(): Observable<any> {
    return this._http.get(`${this.context}/getAll`);
  }
  delete(id: number) {
    return this._http.delete(this.context + "/" + id)
  }
  update(avl: any, id: number) {
    debugger
    return this._http.put(this.context + "/" + id, avl)
  }
  getById(id: number) {
    return this._http.get(this.context + "/" + id);
  }
  getByday(date: any) {
    return this._http.get(this.context + `/GetByDay?date=${date}`);
  }
  month(date: any) {
    return this._http.get(this.context + `/GetBymonth?date=${date}`);
  }
}
