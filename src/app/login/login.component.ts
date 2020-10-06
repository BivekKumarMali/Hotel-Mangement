import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { EmployeeService } from '../shared/service/employee.service';
import { Employee } from '../shared/models/employee';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  User: string;
  Password: string;
  Show: boolean;
  employee: Employee;
  serverShow: boolean;
  constructor(
    private Session: SessionStorageService,
    private router: Router,
    private employeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    if ((this.Session.retrieve('user'))) {
      this.router.navigate(['dashboard']);
    }
  }
  LogIn() {
    this.employeeService.getEmployeeByEmail(this.User).subscribe({
      next: data => this.employee = data,
      error: () => this.serverShow = true,
      complete: () => this.CheckPassword()
    });
  }
  CheckPassword() {
    if (this.employee === null) {
      this.Show = true;
    }
    if (this.Password === this.employee.password) {
      this.Session.store('user', `${this.employee.name},${this.employee.role}`);
      location.reload();
    }
    else {
      this.Show = true;
    }
  }
  resetalert() {
    this.Show = false;
    this.serverShow = false;
  }

}
