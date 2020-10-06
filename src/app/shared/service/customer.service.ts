import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, tap, map } from 'rxjs/operators';
import { Customer } from '../models/customer';
import { RecordService } from './record.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  url: string;
  constructor(private http: HttpClient, private record: RecordService) {
    this.url = environment.url;
  }
  intailizecustomer(): Customer {
    return {
      cid: 0,
      address: '',
      fname: '',
      lname: '',
      bname: '',
      country: '',
      email: '',
      mobile: null,
      state: '',
      zip: null,
      phone: null,
      car: ''
    };
  }
  getAllCustomer(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.url + 'read/customer.php').pipe(
      catchError(this.handleError));
  }
  createCustomer(customer: Customer) {
    this.record.SetRecord('Created', customer, 'Customer');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Customer>(this.url + 'insert/customer.php', customer, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  updateCustomer(customer: Customer, past: Customer): Observable<Customer> {
    this.record.SetRecord('Updated', customer, 'Customer', past);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Customer>(this.url + 'update/customer.php', customer, { headers })
      .pipe(
        map(() => customer),
        catchError(this.handleError)
      );
  }
  getCustomerById(cid: number): Observable<Customer> {
    if (cid === 0) {
      return of(this.intailizecustomer());
    }
    return this.http.get<Customer>(this.url + 'read/customerid.php' + `/?cid=${cid}`)
      .pipe(
        catchError(e => this.handleError(e))
      );
  }
  deleteCustomer(cid: number, customer: Customer): Observable<Customer[]> {
    this.record.SetRecord('Deleted', customer, 'Customer');
    this.http.delete(this.url + 'delete/customer.php' + `/?cid=${cid}`, { responseType: 'text' }).subscribe(
    );
    return this.getAllCustomer();
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
