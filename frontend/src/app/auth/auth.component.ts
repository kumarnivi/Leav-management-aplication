import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

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

  constructor(private userService: UserService,private router: Router) { }

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
            this.router.navigate(['/']); // Redirect to the home page
          },
          (error) => {
            // Registration error
            this.registrationSuccess = false;
            this.registrationError = 'Registration failed. Please try again.'; // Set an error message
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
          this.router.navigate(['/']); // Redirect to the home page
        
        },
        (error) => {
          // Login error
          this.loginSuccess = false;
          this.loginError = 'Login failed. Please check your credentials and try again.'; // Set an error message
        }
      );
    }
  }
  


}
