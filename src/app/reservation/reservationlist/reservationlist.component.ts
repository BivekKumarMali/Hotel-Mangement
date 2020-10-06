import { Component, OnInit } from '@angular/core';
import { Reservation } from 'src/app/shared/models/reservation';
import { Rooms } from 'src/app/shared/models/rooms';
import { Roomtype } from 'src/app/shared/models/roomtype';
import { Customer } from 'src/app/shared/models/customer';
import { ReservationService } from 'src/app/shared/service/reservation.service';
import { RoomService } from 'src/app/shared/service/room.service';
import { RoomtypeService } from 'src/app/shared/service/roomtype.service';
import { CustomerService } from 'src/app/shared/service/customer.service';
import { setUncaughtExceptionCaptureCallback } from 'process';

@Component({
  selector: 'app-reservationlist',
  templateUrl: './reservationlist.component.html',
  styleUrls: ['./reservationlist.component.css']
})
export class ReservationlistComponent implements OnInit {

  Foodname = '';
  Foodcost: number;
  Extra: string[];
  FilterReservation: Reservation[];
  reservation: Reservation[];
  errorMessage: any;
  Show: boolean;
  constructor(
    private reservationservice: ReservationService,
    private roomservice: RoomService,
    private roomtypeservice: RoomtypeService,
    private customerservice: CustomerService) { }

  ngOnInit(): void {
    this.fetchReservation();
  }
  fetchReservation(): void {
    this.reservationservice.getAllReservation().subscribe({
      next: reservation => {
        this.FilterReservation = reservation;
        this.reservation = reservation;
      },
      error: err => this.errorMessage = err,
      complete: () => { this.reservation.reverse(); this.fetchRooms(); }
    });
  }
  fetchRooms(rooms?: Rooms[]) {
    this.roomservice.getAllRooms().subscribe({
      next: room => {
        rooms = room;
      },
      error: err => this.errorMessage = err,
      complete: () => this.fetchRoomtype(rooms)
    });
  }
  fetchRoomtype(rooms: Rooms[], roomtypes?: Roomtype[]): void {
    this.roomtypeservice.getAllRoomstype().subscribe({
      next: roomtype => {
        roomtypes = roomtype;
      },
      error: err => this.errorMessage = err,
      complete: () => this.fetchCustomer(rooms, roomtypes)
    });
  }
  fetchCustomer(rooms: Rooms[], roomtype: Roomtype[], customers?: Customer[]): void {
    this.customerservice.getAllCustomer().subscribe({
      next: customer => {
        customers = customer;
      },
      error: err => this.errorMessage = err,
      complete: () => this.finder(rooms, roomtype, customers)
    });
  }
  finder(rooms: Rooms[], roomtypes: Roomtype[], customers: Customer[]): void {
    for (const reservation of this.reservation) {
      const rm = rooms.find(x => x.rid === reservation.rid);
      const rt = roomtypes.find(x => x.rtid === rm.rtid);
      reservation.roomno = rm.room_no;
      reservation.cost = rt.rent * ((new Date(reservation.checkout).getTime() - new Date(reservation.checkin).getTime()) / 86400000);
      const c = customers.find(x => x.cid === reservation.cid);
      reservation.name = c.fname + ' ' + c.lname;
      reservation.Extra = reservation.extra.split(',');
      for (const extra of reservation.Extra) {
        const array = extra.split(' ');
        if (array[0] === '') {
          continue;
        }
        // tslint:disable-next-line:radix
        reservation.due = parseInt(reservation.due.toString()) + parseInt(array[1]);
      }
    }
  }
  search(filterBy: any) {
  }
  DeleteReservation(bid: number, name: string) {
    const reser = this.reservation.find(x => x.bid === bid);
    this.reservationservice.deleteReservation(bid, reser).subscribe({
      next: () => this.ngOnInit()
    });
  }
  AddExtra(r: Reservation) {
    const reserve = this.FilterReservation.find(x => x === r);
    const past = { ...this.reservation.find(x => x === r) };
    reserve.Extra.push(this.Foodname + ' ' + this.Foodcost);
    // tslint:disable-next-line:radix
    reserve.due = parseInt(reserve.due.toString()) + parseInt(this.Foodcost + '');
    this.Foodcost = null;
    this.Foodname = '';
    reserve.extra = r.Extra.toString();
    this.reservationservice.updateReservation(reserve, past).subscribe();
  }

}
