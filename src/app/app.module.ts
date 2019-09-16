import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//routing 
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ChatModule } from "./chat/chat.module";
import { UserModule } from "./user/user.module";
import { LoginComponent } from "./user/login/login.component";
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from '@angular/common/http'; 
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ChatModule,
    UserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent, pathMatch: 'full'},
      { path: '', redirectTo: 'login', pathMatch: 'full' }, //by default path
      { path: '*', component: LoginComponent},
      { path: '**', component: LoginComponent}  //Not found path
    ])
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
 