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

  async registerUser(email: string, phoneNumber: string, Name: string, displayName: string, password: string, passwordConfirm: string): Promise<any> {
    return this.http.post(ACCOUNT_API + 'registerUser', {
      email,
      phoneNumber,
      Name,
      displayName,
      password,
      passwordConfirm
    }, httpOptions);
  }

  async loginUser(email: string, password: string): Promise<any>{
    return this.http.post(ACCOUNT_API + 'loginUser', {
      email,
      password
    }, httpOptions);
  }

  async updateUser(email: string, phoneNumber: string, Name: string, displayName: string, password: string, passwordConfirm: string): Promise<any>{
    return this.http.put(ACCOUNT_API + 'updateUser', {
      email,
      phoneNumber,
      Name,
      displayName,
      password,
      passwordConfirm
    }, httpOptions);
  }

  async singOut(): Promise<any>{
    return this.http.post(ACCOUNT_API + 'singOut', {}, httpOptions);
  }

  async getCurrentUser(): Promise<any> {
    return this.http.get(ACCOUNT_API + 'getCurrentUser', { responseType: 'text' });
  }

  async deleteUser(EmailAddress: string, Password: string): Promise<any>{
    return this.http.delete(ACCOUNT_API + 'deleteUser', {responseType: 'text'});
  }



}
