import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReceptionistService {
  private readonly db = "http://localhost:5178/api/Receptionist"
  constructor(private readonly client:HttpClient) { }
  getAll(){
    return this.client.get(this.db)
  }
  getById(id:number){
    return this.client.get(this.db + '/' + id)
  }
  add(receptionist:any){
    return this.client.post(this.db, receptionist)
  }
  update(receptionist:any, id:number){
    return this.client.put(this.db+"/"+id, receptionist)
  }
  delete(id:number){
    return this.client.delete(this.db+"/"+id)
  }
}
