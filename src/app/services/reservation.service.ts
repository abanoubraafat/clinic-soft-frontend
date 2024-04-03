import { HttpClient } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly db = "http://localhost:5178/api/Reservation"
  constructor(private readonly client: HttpClient) { }
  getAll() {
    return this.client.get(this.db);
  }
  getByDay(date: any) {
    return this.client.get(this.db + "/GetByDay?date=" + date);
  }
  getById(id: number) {
    return this.client.get(this.db + "/" + id)
  }
  add(reservation: any) {
    return this.client.post(this.db, reservation);
  }
  update(reservation: any, id: number) {
    return this.client.put(this.db + "/" + id, reservation)
  }
  delete(id: number) {
    return this.client.delete(this.db + "/" + id)
  }
  IsValidLast(date:any){
    return this.client.get(this.db + "/IsValidLast?date=" + date)
  }
  getLastReservationOfTheDay(date:any){
    return this.client.get(this.db + "/GetLastReservation?date=" + date)
  }
  //Income From Reservations
  getIncomeByDay(date:any)
  {
    return this.client.get(this.db + "/IncomeByDay?date=" + date)
  }
  getIncomeByMonth(date:any)
  {
    return this.client.get(this.db + "/IncomeByMonth?date=" + date)
  }
  getIncomeByYear(date:any)
  {
    return this.client.get(this.db + "/IncomeByYear?date=" + date)
  }
  getIncomeAllTime()
  {
    return this.client.get(this.db + "/IncomeAllTime")
  }
}
