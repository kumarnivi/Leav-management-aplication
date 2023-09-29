import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-leave-form',
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.css']
})
export class LeaveFormComponent implements OnInit  {

  name: string = '';
  email: string = '';
  dateTo: string = '';
  dateFrom: string = '';
  reason: string = '';
  submittedData: any[] = [];

  isFormVisible = false;
  isButtonVisible = true;

  
  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    // Fetch the submitted data from the backend when the component initializes
    this.fetchSubmittedData();
  }

  submitLeave() {
    const formData = {
      name: this.name,
      email: this.email,
      date_from: this.dateFrom,
      date_to: this.dateTo,
      reason: this.reason
    };
    this.fetchSubmittedData();

    
    this.http.post('http://localhost:8080/api/leave_requests', formData)
      .subscribe(
        (response: any) => {
          console.log('Leave request submitted successfully');
          // Handle success here, e.g., show a success message.
        },
        (error) => {
          console.error('Error submitting leave request:', error);
          // Handle error here, e.g., display an error message.
        }
      );
  }


  private fetchSubmittedData() {
    // Make an HTTP GET request to fetch the submitted data from the backend
    this.http.get<any[]>('http://localhost:8080/api/leave_requests')
      .subscribe(
        (data) => {
          // Update the submittedData array with the fetched data
          this.submittedData = data;
        },
        (error) => {
          console.error('Error fetching leave requests:', error);
          // Handle error here, e.g., display an error message.
        }
      );
  }
  

  
  toggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
    this.isButtonVisible = !this.isButtonVisible; 
  }
}
