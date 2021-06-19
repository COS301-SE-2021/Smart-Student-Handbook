import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  public loginFailed = false;
  //private returnUrl: string;

  constructor( private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private accountService: AccountService)
  {
    //this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/notebook';

    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void>
  {
    // if (await this.accountService.checkAuthenticated()) {
    //   await this.router.navigate([this.returnUrl]);
    // }
  }

  async onSubmit(): Promise<void>
  {
    this.loginFailed = false;

    if (this.form.valid)
    {
        const username = this.form.get('username')?.value;
        const password = this.form.get('password')?.value;

        this.accountService.login(username, password).then(data => {
            //this.isLoginFailed = false;
            //this.isLoggedIn = true;
            this.router.navigateByUrl(`notebook`);
          },
          err => {
            this.loginFailed = true;
            //this.errorMessage = err.error.message;
            //this.isLoginFailed = true;
            //window.location.reload();
          }
        );
    }
  }

}
