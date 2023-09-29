import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  userArray: any[] = [];
  isResultLoaded?: boolean;
  isUpdateFormActive?: false;

  name: string = '';
  email: string = '';
  phonenum: string = '';
  NIC:string = ""
  currrentUserID = '';

  constructor(private http: HttpClient) {
    this.getAllUser();
  }

  ngOnInit(): void {}
  //  for view all user
  getAllUser() {
    this.http
      .get('http://localhost:8080/api/student/')
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        console.log(resultData.data);
        this.userArray = resultData.data;
      });
  }

  // add user
  register() {
    let bodyData = {
      name: this.name,
      email: this.email,
      phonenum: this.phonenum,
      NIC:this.NIC
    };

    this.http
      .post('http://localhost:8080/api/student/add', bodyData)
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert('Employee added Successfully');
        this.getAllUser();
        //here get a users name,email,phonenum
      });
  }

  // for update the user
  setUpdate(data: any) {
    this.name = data.name;
    this.email = data.email;
    this.phonenum = data.phonenum;
    this.NIC = data.NIC
    this.currrentUserID = data.id;
  }
  updateRecords() {
    let bodyData = {
      name: this.name,
      emai: this.email,
      phonenum: this.phonenum,
      NIC : this.NIC
    };
    this.http
      .put(
        'http://localhost:8080/api/student/update' + '/' + this.currrentUserID,
        bodyData
      )
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert('user Updated SUccessfull');
        this.getAllUser();
      });
  }

  // save the detail
  save() {
    if (this.currrentUserID == '') {
      this.register();
    }
    else {
      this.updateRecords;
    }
    
    
  }

  // delete user

  setDelete(data: any) {
    this.http
      .delete('http://localhost:8080/api/student/delete' + '/' + data.id)
      .subscribe((resultData: any) => {
        console.log(resultData);
        alert('Deleted Successfully');
        this.getAllUser;
      });
  }
}
