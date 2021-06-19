import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  public registerFailed = false;
  //private returnUrl: string;

  constructor( private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private accountService: AccountService)
  {
    //this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/notebook';

    this.form = this.fb.group({
      email: ['', Validators.email],
      phoneNumber: ['', Validators.required],
      displayName: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void>
  {
    document.body.className = "backgroundIMG";
    // if (await this.accountService.checkAuthenticated()) {
    //   await this.router.navigate([this.returnUrl]);
    // }
  }

  ngOnDestroy(){
    document.body.className="";
  }

  async onSubmit(): Promise<void>
  {
    this.registerFailed = false;

    if (this.form.valid)
    {
      const email = this.form.get('email')?.value;
      const phoneNumber = this.form.get('phoneNumber')?.value;
      const displayName = this.form.get('displayName')?.value;
      const password = this.form.get('password')?.value;
      const passwordConfirm = this.form.get('passwordConfirm')?.value;

      this.accountService.registerUser(email,phoneNumber,displayName,password,passwordConfirm).then(data => {
          //this.isLoginFailed = false;
          //this.isLoggedIn = true;
          this.router.navigateByUrl(`notebook`);
        },
        err => {
          this.registerFailed = true;
          //this.errorMessage = err.error.message;
          //this.isLoginFailed = true;
          //window.location.reload();
        }
      );
    }
  }

}
