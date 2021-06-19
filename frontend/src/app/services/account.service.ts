import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const ACCOUNT_API = 'http://localhost:5001/account/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  async login(EmailAddress: string, Password: string): Promise<any>{
    return this.http.post(ACCOUNT_API + 'Login', {
      EmailAddress,
      Password
    }, httpOptions);
  }

  async register(EmailAddress: string, Password: string, Name: string): Promise<any> {
    return this.http.post(ACCOUNT_API + 'Register', {
      EmailAddress,
      Password,
      Name
    }, httpOptions);
  }

}
