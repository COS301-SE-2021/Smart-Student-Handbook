import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from './profile.service';

const ACCOUNT_API = 'http://localhost:5001/account/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient, private router: Router, private profileService: ProfileService) { }

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
    return this.http.post(ACCOUNT_API + 'signOut', {}, httpOptions);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(ACCOUNT_API + 'getCurrentUser', { responseType: 'json' });
  }

  deleteUser(EmailAddress: string, Password: string): Observable<any>{
    return this.http.delete(ACCOUNT_API + 'deleteUser', {responseType: 'json'});
  }

  //check if user is logged in then roots to the notebook else to login if not logged in
  async isUserLoggedIn():  Promise<void>{

    let curentRoute = this.router.url.split('?')[0];

    //first check if the user value has been set in the localstorage...

    this.getCurrentUser().subscribe(data => {

        this.profileService.getUserDetails(data.uid).subscribe(user =>{
            localStorage.setItem("userProfile",JSON.stringify(user));
        },
          err => {
            console.log("Error: "+err.error.message);
          });

        localStorage.setItem("user",JSON.stringify(data));

        //if the user is logged in and they are not in the login, register or forgot password then take them to the notebook page
        if(curentRoute == "/" || curentRoute == "/login" || curentRoute == "/register" || curentRoute == "/forgotPassword")
        {
          this.router.navigateByUrl(`/notebook`);
        }
      },
      err => {
        console.log(err.error.message);
        //if the user is not logged in allow them to navigate login, register and forgotPassword
        if(curentRoute !== "/" && curentRoute !== "/login" && curentRoute !== "/register" && curentRoute !== "/forgotPassword")
        {
          this.router.navigateByUrl(`/login`);
        }
      }
    );
  }

}
