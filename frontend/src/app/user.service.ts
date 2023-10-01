import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/users'; // Replace with your backend API URL
  private isAuthenticated = false;
  constructor(private http: HttpClient) { }

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password });
  }

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
    this.isAuthenticated = true;
  }

  logout() {
    this.isAuthenticated = false;
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  requestPasswordChange(email: string) {
    return this.http.post(`${this.apiUrl}/request-password-change`, { email });
  }

  resetPassword(email: string, token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, token, newPassword });
  }


  
  submitLeave(formData: any) {
    return this.http.post('localhost/8080/api/leave_requests', formData);
  }

  fetchSubmittedData(formData: any) {
    return this.http.get('localhost/8080/api/leave_requests', formData);
  }


}
