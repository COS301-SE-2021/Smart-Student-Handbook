import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

const PROFILE_API = 'http://localhost:5001/user/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient, private router: Router) { }

  getUserDetails(userId: string): Observable<any> {
    return this.http.get(PROFILE_API + 'getUserDetails/'+userId, { headers: {'Content-Type':'application/json'}, responseType: 'json' });
  }

  createUser(uid: string, name?: string, institution?: string, department?:string, program?:string, workStatus?:string, bio?:string, dateJoined?:string ): Observable<any> {
    return this.http.post(PROFILE_API + 'createUser', {
      uid,
      name,
      institution,
      department,
      program,
      workStatus,
      bio,
      dateJoined,
    }, httpOptions);
  }

  updateUser(uid: string, name?: string, institution?: string, department?:string, program?:string, workStatus?:string, bio?:string, dateJoined?:string ): Observable<any> {
    return this.http.post(PROFILE_API + 'updateUser', {
      uid,
      name,
      institution,
      department,
      program,
      workStatus,
      bio,
      dateJoined,
    }, httpOptions);
  }
}
