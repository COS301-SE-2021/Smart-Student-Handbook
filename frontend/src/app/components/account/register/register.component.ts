import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { MustMatch } from './must-match.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  registerFailed = false;
  submitted = false;
  errorMessage: string = "";

  constructor( private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private accountService: AccountService)
  {
    this.form = this.fb.group({
      email: ['', Validators.email],
      phoneNumber: ['', Validators.required],
      displayName: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'passwordConfirm')
    });
  }

  async ngOnInit(): Promise<void>
  {
    document.body.className = "backgroundIMG";
  }

  ngOnDestroy(){
    document.body.className="";
  }

  async onSubmit(): Promise<void>
  {
    this.registerFailed = false;
    this.submitted = true;

    if (this.form.valid)
    {
      const email = this.form.get('email')?.value;
      const phoneNumber = this.form.get('phoneNumber')?.value;
      const displayName = this.form.get('displayName')?.value;
      const password = this.form.get('password')?.value;
      const passwordConfirm = this.form.get('passwordConfirm')?.value;

      this.accountService.registerUser(email,phoneNumber,displayName,password,passwordConfirm).subscribe(data => {
          this.router.navigateByUrl(`notebook`);
        },
        err => {
          this.registerFailed = true;
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