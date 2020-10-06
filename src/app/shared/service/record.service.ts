import { Injectable } from '@angular/core';
import { Record } from '../models/record';
import { SessionStorageService } from 'ngx-webstorage';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  constructor(
    private Session: SessionStorageService,
    private http: HttpClient) {
    this.url = environment.url;
  }
  url: string;
  record: Record = {
    action: '',
    date: '',
    time: '',
    name: this.GetName(),
    rdid: 0,
    section: '',
    status: '',
    status2: '',
    room: null,
    room2: null,
  };
  GetName() {
    const str = this.Session.retrieve('user');
    if (str) {
      const array = str.split(',');
      return array[0];
    }
    return '';
  }
  SetRecord(action: string, value: any, type: string, updated?: any) {
    this.record.date = new Date().toDateString();
    this.record.time = new Date().getHours() + ':' + new Date().getMinutes();
    this.record.action = action;
    this.record.section = type;
    this.record.status = JSON.stringify(value);
    this.record.status2 = JSON.stringify(value);
    if (action === 'Updated') {
      this.record.status2 = JSON.stringify(updated);
    }
    this.createRecord(this.record).subscribe();
  }
  createRecord(record: Record) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Record>(this.url + 'insert/record.php', record, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  getAllRecord(): Observable<Record[]> {
    return this.http.get<Record[]>(this.url + 'read/record.php').pipe(
      catchError(this.handleError));
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
