import { Component, OnInit } from '@angular/core';
import { AppService } from './../../app.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private email:any;
  private password:any;

  constructor( private appService:AppService, private toastr:ToastrService, private cookie:CookieService, private router:Router) { }

  ngOnInit() {
  }

  public logInFunction:any = () =>{

    if(!this.email) {
      this.toastr.warning('please enter email', 'warning');
    } else if (!this.password) {
      this.toastr.warning('please enter password', 'warning');
    } else {
      let data = {
        email:this.email,
        password: this.password
      }
      this.appService.signinFunction(data)
      .subscribe((apiResponse) =>{
        if(apiResponse.status === 200) {
          console.log(apiResponse);
          this.cookie.set('authtoken', apiResponse.data.authtoken);
          this.cookie.set('receivedId', apiResponse.data.userDetails.userId);
          this.cookie.set('receiverName', apiResponse.data.userDetails.firstName + ' '+ apiResponse.data.userDetails.lastName);
          this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails);
          this.router.navigate(['/chat']);
        } else {
          this.toastr.error(apiResponse.message, 'error');
        }
      }),
      (error) =>{
          this.toastr.error('some error has occured', 'error');
      }
    }
  }

}
