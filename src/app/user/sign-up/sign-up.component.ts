import { Component, OnInit } from '@angular/core';
import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public firstName: any;
  public lastName: any;
  public email: any;
  public password: any;
  public apiKey: any;
  public mobileNumber: any;

  constructor(
    public appService: AppService, public toastr: ToastrService, public router: Router) { }

  ngOnInit() {
  }

  public goToSignIn: any = () => {
     this.router.navigate(['/']);
  }

  public signUpFunction: any = () => {

    if (!this.firstName) {
      this.toastr.warning('enter first name', 'Warning');
    } else if (!this.lastName) {
      this.toastr.warning('enter last name', 'Warning');
    } else if (!this.email) {
      this.toastr.warning('enter email', 'warning');
    }  else if (!this.password) {
      this.toastr.warning('enter password', 'warning');
    }  else if (!this.apiKey) {
      this.toastr.warning('enter apiKey', 'warning');
    }  else if (!this.mobileNumber) {
      this.toastr.warning('enter mobileNumber', 'warning');
    } else {
      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        apiKey: this.apiKey,
        mobileNumber: this.mobileNumber
      }
      console.log(data);
      this.appService.signupFunction(data)
      .subscribe((apiResponse) => {
        console.log(apiResponse);
        if (apiResponse.status === 200) {
          this.toastr.success('SignUp successful', 'success');
          setTimeout(() => {
            this.goToSignIn();
          }, 2000);
        } else {
          this.toastr.error(apiResponse.message, 'error');
        }
      }, (err) => {
        this.toastr.error('some error occured', 'error');
      });
    }
  }

}



