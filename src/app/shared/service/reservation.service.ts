import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Reservation } from '../models/reservation';
import { RecordService } from './record.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  constructor(private http: HttpClient, private record: RecordService) {
    this.url = environment.url;
  }
  url: string;

  intailizeReservation(): Reservation {
    return {
      bid: 0,
      checkin: null,
      checkout: null,
      cid: 0,
      deposit: null,
      deposit1: null,
      rid: null,
      due: null,
      payment: '',
      payment1: '',
      status: 'Reserved',
      comment: '',
      extra: ''
    };
  }

  getAllReservation(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.url + 'read/reservation.php').pipe(
      catchError(this.handleError));
  }
  createReservation(reservation: Reservation) {
    this.record.SetRecord('Created', reservation, 'Reservation');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Reservation>(this.url + 'insert/reservation.php', reservation, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
  updateReservation(reservation: Reservation, past: Reservation): Observable<Reservation> {
    this.record.SetRecord('Updated', reservation, 'Reservation', past);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Reservation>(this.url + 'update/reservation.php', reservation, { headers })
      .pipe(
        map(() => reservation),
        catchError(this.handleError)
      );
  }
  getReservationById(bid: number): Observable<Reservation> {
    if (bid === 0) {
      return of(this.intailizeReservation());
    }
    return this.http.get<Reservation>(this.url + 'read/reservationid.php' + `/?bid=${bid}`)
      .pipe(
        catchError(e => this.handleError(e))
      );
  }
  deleteReservation(bid: number, reservation: Reservation): Observable<Reservation[]> {
    this.record.SetRecord('Deleted', reservation, 'Reservation');
    this.http.delete(this.url + 'delete/reservation.php' + `/?bid=${bid}`, { responseType: 'text' }).subscribe(
      () => {
        console.log('One employee deleted successfully.');
      }
    );
    return this.getAllReservation();
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
