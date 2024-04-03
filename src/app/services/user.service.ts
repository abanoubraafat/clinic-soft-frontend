import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  res: any;
  static result = new BehaviorSubject(null);
  private readonly db = "http://localhost:5178/api/User"
  constructor(private readonly client: HttpClient) {
    if (localStorage.getItem("user") != null) {
      this.save();
    }
  }
  getAll() {
    return this.client.get(this.db)
  }
  getById(id: number) {
    return this.client.get(this.db + '/' + id)
  }
  add(user: any) {
    return this.client.post(this.db, user)
  }
  update(user: any, id: number) {
    return this.client.put(this.db + "/" + id, user)
  }
  delete(id: number) {
    return this.client.delete(this.db + "/" + id)
  }
  IsExistingEmail(email: string) {
    return this.client.get(this.db + "/EmailCheck?email=" + email)
  }
  get_users(): Observable<any> {
    return this.client.get(`${this.db}/getAll`);
  }
  loginUser(email: string, password: string): Observable<any> {
    var email: string = email;
    var password: string = password;
    return this.client.get(`${this.db}/login?email=${email}&passward=${password}`);
  }
  save() {
    this.res = localStorage.getItem("user");
    UserService.result.next(this.res);
  }
  logout(): void {
    localStorage.removeItem("user");
    UserService.result.next(null);
  }
}
