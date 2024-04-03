import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatientServiceService {
  private readonly db = "http://localhost:5178/api/Patient"
  constructor(private readonly client:HttpClient)
  { }
  getAll(){
    return this.client.get(this.db+"/GetinfoonlyPatient");
  }
  getAllInfo()
  {
    return this.client.get(this.db+"/GetinfoonlyPatient");
  }
  getAllInfobyId(id:any)
  {
    return this.client.get(this.db+"/"+id);
  }
  delete(id:number){
    return this.client.delete(this.db+"/"+id)
  }
  addnewPatient(patient:any){
    return this.client.post(this.db,patient);
  }
  update(patient:any, id:number){
    return this.client.put(this.db+"/"+id, patient)
  }
}
