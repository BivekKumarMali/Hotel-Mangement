import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Employee } from '../models/employee';
import { RecordService } from './record.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  url: string;
  constructor(private http: HttpClient, private record: RecordService) {
    this.url = environment.url;
  }
  intailizeEmployee(): Employee {
    return {
      eid: 0,
      name: '',
      role: '',
      status: '',
      remarks: '',
      mail: '',
      joining: new Date(),
      mobile: null,
      password: '',
      paid: ''
    };
  }
  getAllEmployee(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.url + 'read/employee.php').pipe(
      catchError(this.handleError));
  }
  createEmployee(employee: Employee) {
    this.record.SetRecord('Created', employee, 'Employee');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Employee>(this.url + 'insert/employee.php', employee, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  updateEmployee(employee: Employee, past?: Employee, paid?: string): Observable<Employee> {
    if (paid) {
      this.record.SetRecord('Paid', employee, 'Employee');
    }
    else {
      this.record.SetRecord('Updated', employee, 'Employee', past);
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Employee>(this.url + 'update/employee.php', employee, { headers })
      .pipe(
        map(() => employee),
        catchError(this.handleError)
      );
  }
  deleteEmployee(eid: number, employee: Employee): Observable<Employee[]> {
    this.record.SetRecord('Deleted', employee, 'Employee');
    this.http.delete(this.url + 'delete/employee.php' + `/?eid=${eid}`, { responseType: 'text' }).subscribe(
    );
    return this.getAllEmployee();
  }
  getEmployeeByEmail(mail: string): Observable<Employee> {
    return this.http.get<Employee>(this.url + 'read/employeeemail.php' + `/?mail=${mail}`)
      .pipe(
        map(data => data),
        catchError(e => this.handleError(e))
      );
  }
  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.log(err);
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
