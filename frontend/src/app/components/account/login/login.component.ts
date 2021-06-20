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
  loginFailed = false;
  errorMessage: string = "";

  constructor( private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private accountService: AccountService)
  {
    this.form = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void>
  {
    //if user is already logged in move them to the notebook page, if not return to login
    await this.accountService.isUserLoggedIn();
    document.body.className = "backgroundIMG";
  }

  ngOnDestroy(){
    document.body.className="";
  }

  async onSubmit(): Promise<void>
  {
    this.loginFailed = false;

    if (this.form.valid)
    {
        const email = this.form.get('email')?.value;
        const password = this.form.get('password')?.value;

        this.accountService.loginUser(email, password).subscribe(data => {
          this.loginFailed = false;
            this.router.navigateByUrl(`notebook`);
          },
          err => {
            this.loginFailed = true;
            this.errorMessage = "Error: "+err.error.message;
          }
        );
    }
    else
    {
      return;
    }
  }

}
