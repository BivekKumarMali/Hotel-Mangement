import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Roomtype } from '../models/roomtype';
import { RecordService } from './record.service';

@Injectable({
  providedIn: 'root'
})
export class RoomtypeService {

  url: string;
  constructor(private http: HttpClient, private record: RecordService) {
    this.url = environment.url;
  }
  intailizeRoomType(): Roomtype {
    return {
      rent: null,
      name: '',
      rtid: 0,
      tax: 0,
      exrent: 0,
      nop: 0
    };
  }

  createRoomType(roomtype: Roomtype) {
    this.record.SetRecord('Created', roomtype, 'Roomtype');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Roomtype>(this.url + 'insert/roomtype.php', roomtype, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  updateRoomType(roomtype: Roomtype, past: Roomtype): Observable<Roomtype> {
    this.record.SetRecord('Updated', roomtype, 'Roomtype', past);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Roomtype>(this.url + 'update/roomtype.php', roomtype, { headers })
      .pipe(
        map(() => roomtype),
        catchError(this.handleError)
      );
  }
  getAllRoomstype(): Observable<Roomtype[]> {
    return this.http.get<Roomtype[]>(this.url + 'read/roomtype.php').pipe(
      catchError(this.handleError));
  }
  deleteroomtype(rtid: number, roomtype: Roomtype): Observable<Roomtype[]> {
    this.record.SetRecord('Deleted', roomtype, 'Roomtype');
    this.http.delete(this.url + 'delete/roomtype.php' + `/?rtid=${rtid}`, { responseType: 'text' }).subscribe(
      () => {
        console.log('One roomtype deleted successfully.');
      }
    );
    return this.getAllRoomstype();
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
