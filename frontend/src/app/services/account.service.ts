import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

const ACCOUNT_API = 'http://localhost:5001/account/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient, private router: Router) { }

  registerUser(email: string, phoneNumber: string, displayName: string, password: string, passwordConfirm: string): Observable<any> {
    return this.http.post(ACCOUNT_API + 'registerUser', {
      email,
      phoneNumber,
      displayName,
      password,
      passwordConfirm
    }, httpOptions);
  }

  loginUser(email: string, password: string): Observable<any>{
    return this.http.post(ACCOUNT_API + 'loginUser', {
      email,
      password
    }, httpOptions);
  }

  updateUser(email: string, phoneNumber: string, displayName: string, password: string, passwordConfirm: string): Observable<any>{
    return this.http.put(ACCOUNT_API + 'updateUser', {
      email,
      phoneNumber,
      displayName,
      password,
      passwordConfirm
    }, httpOptions);
  }

  singOut(): Observable<any>{
    return this.http.post(ACCOUNT_API + 'singOut', {}, httpOptions);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(ACCOUNT_API + 'getCurrentUser', { responseType: 'text' });
  }

  deleteUser(EmailAddress: string, Password: string): Observable<any>{
    return this.http.delete(ACCOUNT_API + 'deleteUser', {responseType: 'text'});
  }

  //check if user is logged in then roots to the notebook else to login if not logged in
  async isUserLoggedIn():  Promise<void>{
    this.getCurrentUser().subscribe(data => {
        this.router.navigateByUrl(`notebook`);
      },
      err => {
        console.log(err.error.message);
        this.router.navigateByUrl(`login`);
      }
    );
  }



}
