import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './Components/user/user.component';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule }from '@angular/forms';
import { LeaveFormComponent } from './Components/leave-form/leave-form.component';
import { AuthComponent } from './auth/auth.component'
import { UserService } from './user.service';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './Components/nav/nav.component';
import { HeaderComponent } from './Components/header/header.component';
import { PagesComponent } from './pages/pages.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    LeaveFormComponent,
    AuthComponent,
    HomeComponent,
    NavComponent,
    HeaderComponent,
    PagesComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
