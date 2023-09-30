import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-auth',
  templateUrl: 'auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  name: string = '';
  email: string = '';
  password: string = '';
  isRegistrationMode: boolean = false; 
  registrationSuccess: boolean = false;
  registrationError: string = '';
  loginSuccess:Boolean = false 
  loginError:string= ''

  constructor(private userService: UserService,private router: Router,private toastr: ToastrService) { }

  toggleMode() {
    this.isRegistrationMode = !this.isRegistrationMode;
  }

  submitForm() {
    if (this.isRegistrationMode) {
      // Registration logic
      this.userService.register(this.name, this.email, this.password)
        .subscribe(
          (response:any) => {
            // Registration success
            this.registrationSuccess = true;
            this.registrationError = ''; // Clear any previous error message
            this.router.navigate(['/leave-form']); // Redirect to the home page
            this.toastr.success('Registration successful!', 'Success');
          },
          (error) => {
            // Registration error
            this.registrationSuccess = false;
            this.registrationError = 'Registration failed. Please try again.'; // Set an error message

            this.toastr.error('Registration failed. Please try again.', 'Error');
          }
        );
    } else {
      // Login logic
      
      console.log('Login data:', this.name, this.email);
      // Implement your login API call or logic here
      this.userService.login( this.email, this.password )
      .subscribe (
        (response:any) => {
          // Login success
          this.loginSuccess = true;
          this.loginError = ''; // Clear any previous error message
          this.router.navigate(['/leave-form']); // Redirect to the home page
        
          this.toastr.success('Login successful!', 'Success');
        },
        (error) => {
          // Login error
          this.loginSuccess = false;
          this.loginError = 'Login failed. Please check your credentials and try again.'; // Set an error message
      
          this.toastr.error('Login failed. Please check your credentials and try again.', 'Error');
        }
      );
    }
  }
  


}
