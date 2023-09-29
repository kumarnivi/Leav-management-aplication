import { NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { UserComponent } from './Components/user/user.component';
import { LeaveFormComponent } from './Components/leave-form/leave-form.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './Components/nav/nav.component';

const routes: Routes = [
  // { path: '', component: NavComponent },
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
