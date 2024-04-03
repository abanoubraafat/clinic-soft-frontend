import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OperationService {
  private readonly db = "http://localhost:5178/api/Operation"
 constructor(private readonly client:HttpClient) { }

  getAll(){
    return this.client.get(this.db+"/All");
  }

  delete(id:number){
    return this.client.delete(this.db+"/"+id)
  }

  addnewOperation(Operation:any){
    return this.client.post(this.db,Operation);
  }
  update(operation:any, id:number){
    return this.client.put(this.db+"/"+id, operation)
  }
  getById(id:number){
    return this.client.get(this.db+"/"+id)
  }
  getByDay(date: any) {
    return this.client.get(this.db + "/GetByDay?date=" + date);
  }

}
