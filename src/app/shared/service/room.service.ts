import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Rooms } from '../models/rooms';
import { RecordService } from './record.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  constructor(private http: HttpClient, private record: RecordService) {
    this.url = environment.url;
  }
  url: string;

  intailizeRoom(): Rooms {
    return {
      status: 'Active',
      rid: 0,
      room_no: null,
      rtid: 0,
      type: ''
    };
  }

  deleteroom(rid: number, rooms: Rooms): Observable<Rooms[]> {
    this.record.SetRecord('Deleted', rooms, 'Room');
    this.http.delete(this.url + 'delete/room.php' + `/?rid=${rid}`, { responseType: 'text' }).subscribe(
      () => {
        console.log('One room deleted successfully.');
      }
    );
    return this.getAllRooms();
  }
  updateRoom(rooms: Rooms, past: Rooms): Observable<Rooms> {
    this.record.SetRecord('Updated', rooms, 'Room', past);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Rooms>(this.url + 'update/room.php', rooms, { headers })
      .pipe(
        map(() => rooms),
        catchError(this.handleError)
      );
  }
  createRoom(rooms: Rooms) {
    this.record.SetRecord('Created', rooms, 'Room');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Rooms>(this.url + 'insert/room.php', rooms, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  getAllRooms(): Observable<Rooms[]> {
    return this.http.get<Rooms[]>(this.url + 'read/room.php').pipe(
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
