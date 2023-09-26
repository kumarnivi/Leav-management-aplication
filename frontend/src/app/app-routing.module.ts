import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { LeaveFormComponent } from './leave-form/leave-form.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [

  { path: '', component: HomeComponent },
  {path:'user',component:UserComponent},
  {path:'leave-form', component:LeaveFormComponent},
  {path:'auth', component:AuthComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
