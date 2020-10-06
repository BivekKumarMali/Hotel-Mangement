import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/shared/service/employee.service';
import { Employee } from 'src/app/shared/models/employee';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  pagetitle = 'Add';
  Employee: Employee;
  Employees: Employee[];
  FilterEmployee: Employee[];
  listFilter: string;
  errorMessage: string;
  active: string;
  date: number;
  Confirmation = 0;
  status: string[] = ['Active', 'Inactive'];
  roles: string[] = ['Manager', 'Receptionist', 'Other'];
  constructor(
    private Employeeervice: EmployeeService
  ) { }

  ngOnInit() {
    this.Employee = this.Employeeervice.intailizeEmployee();
    this.fetchEmployee();
    const date = new Date();
    this.date = date.getDate();
  }
  fetchEmployee(): void {
    this.Employeeervice.getAllEmployee().subscribe({
      next: employee => {
        this.Employees = employee;
        this.FilterEmployee = employee;
      },
      error: err => this.errorMessage = err,
      complete: () => this.changepaid()
    });
  }
  changepaid() {
    if (this.date === 1) {
      for (const employee of this.Employees) {
        employee.paid = '0';
        this.Employeeervice.updateEmployee(employee).subscribe();
      }
    }
  }
  paid(eid: number) {
    // tslint:disable-next-line:prefer-const
    let employee = this.Employees.find(x => x.eid === eid);
    employee.paid = '1';
    const past = employee;
    this.Employeeervice.updateEmployee(employee, past, 'Paid').subscribe({
      next: () => this.ngOnInit(),
      complete: () => alert('Completed your request')
    });
  }
  saveEmployee(): void {
    if (this.Employee.eid === 0) {
      this.Employeeervice.createEmployee(this.Employee).subscribe({
        next: () => this.ngOnInit(),
        complete: () => this.formdisplay()
      });
    } else {
      const past = this.Employees.find(x => x.eid === this.Employee.eid);
      this.Employeeervice.updateEmployee(this.Employee, past).subscribe({
        next: () => this.ngOnInit(),
        complete: () => this.formdisplay()
      });
    }
  }
  Edit(employee: Employee): void {
    this.formdisplay();
    const { password, joining, remarks, eid, status, mail, mobile, name, role, paid } = employee;
    this.Employee = { eid, role, name, mobile, mail, status, remarks, joining, password, paid };
    this.pagetitle = 'Edit';
  }
  DeleteEmployeeType(fid: number, Name: string): void {
    const past = this.Employees.find(x => x.eid === fid);
    if (confirm('Delete ' + Name + ' from the list?')) {
      this.Employeeervice.deleteEmployee(fid, past);
      location.reload();
    }
  }
  formdisplay() {
    this.active = this.active ? '' : 'activate';
    this.pagetitle = 'Add';
  }
  search(filterBy: any) {
    if (typeof filterBy === 'string') {
      this.FilterEmployee = filterBy ? this.performFilterByType(filterBy) : this.Employees;
    }
    else {
      this.FilterEmployee = filterBy ? this.performFilterByNo(filterBy) : this.Employees;
    }
  }
  performFilterByType(filterBy: string): Employee[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.Employees.filter((employee: Employee) =>
      employee.name.toLocaleLowerCase().indexOf(filterBy) !== -1);

  }
  performFilterByNo(filterBy: number): Employee[] {
    const ilterBy = filterBy.toLocaleString();
    return this.Employees.filter((employee: Employee) =>
      employee.mobile.toLocaleString().indexOf(ilterBy) !== -1);

  }
  Reset() {
    this.Employee = this.Employeeervice.intailizeEmployee();
    this.formdisplay();
  }

}
