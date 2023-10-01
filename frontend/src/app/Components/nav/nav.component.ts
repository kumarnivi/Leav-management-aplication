import { Component } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

constructor(private userService: UserService,private router: Router){}

  logout() {
    // Call the logout method from your UserService to clear authentication state.
    this.userService.logout();

    // Redirect to the login page after logout.
    this.router.navigate(['/login']);
  }
}
