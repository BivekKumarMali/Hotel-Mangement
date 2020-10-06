import { Component, OnInit } from '@angular/core';
import { Rooms } from 'src/app/shared/models/rooms';
import { Adc } from 'src/app/shared/models/adc';
import { Reservation } from 'src/app/shared/models/reservation';
import { Roomtype } from 'src/app/shared/models/roomtype';
import { Router } from '@angular/router';
import { Customer } from 'src/app/shared/models/customer';
import { RoomService } from 'src/app/shared/service/room.service';
import { ReservationService } from 'src/app/shared/service/reservation.service';
import { RoomtypeService } from 'src/app/shared/service/roomtype.service';
import { CustomerService } from 'src/app/shared/service/customer.service';

@Component({
  selector: 'app-advanced-calandra',
  templateUrl: './advanced-calandra.component.html',
  styleUrls: ['./advanced-calandra.component.css']
})
export class AdvancedCalandraComponent implements OnInit {

  advancedCalendra: Adc[];
  adc: Adc;
  pastStatus: string;
  date = new Date();
  reservations: Reservation[];
  reservation = this.reservationservice.intailizeReservation();
  customer = this.customerservice.intailizecustomer();
  customers: Customer[];
  dayArr: number[];
  lastday: number;
  monthno: number;
  monthArray: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  errorMessage: any;
  rooms: Rooms[];
  month: string;
  roomtype: Roomtype[];
  show: string;
  status = ['Booked', 'Available', 'Checked In', 'Free', 'Free Debit', 'Uncleaned', 'To Be Repaired', 'Other'];
  constructor(
    private roomservice: RoomService,
    private reservationservice: ReservationService,
    private roomtypeservice: RoomtypeService,
    private router: Router,
    private customerservice: CustomerService) { }

  ngOnInit(): void {
    this.setDate();
    this.fetchReservation();
    this.FetchCustomer();
  }
  FetchCustomer() {
    this.customerservice.getAllCustomer().subscribe({
      next: customer => {
        this.customers = customer;
      },
      error: err => this.errorMessage = err,
    });
  }
  fetchReservation(): void {
    this.reservationservice.getAllReservation().subscribe({
      next: reservation => {
        this.reservations = reservation;
      },
      error: err => this.errorMessage = err,
      complete: () => this.fetchRooms()
    });
  }
  fetchRooms(): void {
    this.roomservice.getAllRooms().subscribe({
      next: room => {
        this.rooms = room;
      },
      error: err => this.errorMessage = err,
      complete: () => this.fetchRoomtype()
    });
  }
  fetchRoomtype() {
    this.roomtypeservice.getAllRoomstype().subscribe({
      next: roomtype => {
        this.roomtype = roomtype;
      },
      error: err => this.errorMessage = err,
      complete: () => this.setArrays()
    });
  }
  setArrays() {
    // tslint:disable-next-line:prefer-for-of
    this.advancedCalendra = new Array(this.rooms.length);
    for (const rm of this.rooms) {
      const rt = this.roomtype.find(x => x.rtid === rm.rtid);
      rm.type = rt.name;
    }
    for (let i = 0; i < this.rooms.length; i++) {
      this.advancedCalendra[i] = this.intialize();
      this.advancedCalendra[i].room = this.rooms[i].type + ' ' + this.rooms[i].room_no;
      this.advancedCalendra[i].rid = this.rooms[i].rid;
    }
    for (const re of this.reservations) {
      // tslint:disable-next-line:max-line-length
      if ((new Date(re.checkin).getFullYear() === this.date.getFullYear() && (new Date(re.checkout).getFullYear() === this.date.getFullYear()))) {
        // tslint:disable-next-line:max-line-length
        if ((new Date(re.checkin).getMonth() === new Date(re.checkout).getMonth()) && ((new Date(re.checkin).getMonth()) === this.monthno)) {
          this.setDateTrue(re.bid, re.rid, (new Date(re.checkin).getDate() - 1), (new Date(re.checkout).getDate() - 1), re.status);
        }
        else if ((new Date(re.checkin).getMonth() === this.monthno)) {
          this.setDateTrue(re.bid, re.rid, (new Date(re.checkin).getDate() - 1), this.dayArr.length, re.status);
        }
        else if ((new Date(re.checkout).getMonth() === this.monthno)) {
          this.setDateTrue(re.bid, re.rid, 0, (new Date(re.checkout).getDate() - 1), re.status);
        }
        else if ((new Date(re.checkin).getMonth() < this.date.getMonth() && this.date.getMonth() < new Date(re.checkout).getMonth())) {
          this.setDateTrue(re.bid, re.rid, 0, this.dayArr.length, re.status);
        }
      }
      else if ((new Date(re.checkin).getFullYear() === this.date.getFullYear()) && (new Date(re.checkin).getMonth() === this.monthno)) {
        this.setDateTrue(re.bid, re.rid, (new Date(re.checkin).getDate() - 1), this.dayArr.length, re.status);
      }
      else if ((new Date(re.checkout).getFullYear() === this.date.getFullYear()) && (new Date(re.checkout).getMonth() === this.monthno)) {
        this.setDateTrue(re.bid, re.rid, 0, (new Date(re.checkout).getDate() - 1), re.status);
      }
    }
  }
  intialize(): Adc {
    return {
      rid: null,
      room: null,
      in: new Date(),
      out: new Date(),
      day: new Array(this.dayArr.length),
      status: new Array(this.dayArr.length)
    };
  }
  setDateTrue(bid: number, id: number, start: number, end: number, status: string) {
    const adc = this.advancedCalendra.find(x => x.rid === id);
    const index = this.advancedCalendra.findIndex(x => x.rid === id);
    // tslint:disable-next-line:prefer-for-of
    for (let j = start; j < end; j++) {
      adc.day[j] = bid;
      adc.status[j] = status;
    }
    this.advancedCalendra[index] = adc;
  }
  setDate() {
    this.monthno = this.date.getMonth();
    this.month = this.monthArray[this.monthno];
    this.dayArr = [];
    const lastday = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
    const lastdate = lastday.getDate();
    for (let i = 1; i <= lastdate; i++) {
      this.dayArr.push(i);
    }
  }
  IncrementMonth() {
    this.date = new Date(this.date.getTime() + 2629800000);
    this.ngOnInit();
  }
  DecrementMonth() {
    this.date = new Date(this.date.getTime() - 2629800000);
    this.ngOnInit();
  }
  GetDetails(index?: number, iadc?: number) {
    if (index >= 0 && iadc >= 0) {
      this.adc = this.advancedCalendra[iadc];
      const bid = this.adc.day[index];
      this.reservation = this.reservations.find(x => x.bid === bid);
      this.pastStatus = this.reservation.status;
      this.customer = this.customers.find(x => x.cid === this.reservation.cid);
      const rm = this.rooms.find(x => x.rid === this.reservation.rid);
      this.reservation.roomno = rm.room_no;
      const rt = this.roomtype.find(x => x.rtid === rm.rtid);
      this.reservation.cost = rt.rent;
      this.reservation.type = rt.name;
    }
    this.show = this.show ? '' : 'activate';
  }
  SetStatus() {
    // tslint:disable-next-line:prefer-const
    let past = { ...this.reservations.find(x => x === this.reservation) };
    past.status = this.pastStatus;
    this.reservationservice.updateReservation(this.reservation, past).subscribe({
      complete: () => this.ngOnInit()
    });
  }
  DeleteReservation() {
    if (confirm('Would you like to Delete')) {
      this.reservationservice.deleteReservation(this.reservation.bid, this.reservation).subscribe({
        next: () => this.ngOnInit()
      });
    }
  }
  myStyle(a: any, i: number, bid: number) {
    const adc = this.advancedCalendra.find(x => x.day[i] === bid);
    const myStyles = {
      // tslint:disable-next-line:max-line-length
      'background-color': a === 'Booked' ? '#e6e993' : a === 'Checked In' ? '#e8505b' : a === 'Free' ? 'green' : a === 'Free Debit' ? 'blue' : a === 'Uncleaned' ? 'orange' : a === 'To Be Repaired' ? 'pink' : a === 'Other' ? 'lightblue' : '',
      // tslint:disable-next-line:max-line-length
      'border-color': a === 'Booked' ? '#e6e993' : a === 'Checked In' ? '#e8505b' : a === 'Free' ? 'green' : a === 'Free Debit' ? 'blue' : a === 'Uncleaned' ? 'orange' : a === 'To Be Repaired' ? 'pink' : a === 'Other' ? 'lightblue' : '',
      'border-right': (adc.day[i] !== adc.day[i + 1]) ? '2px solid black' : (adc.day[i] === undefined) ? '0.1px solid thin black' : 'none',
      'border-left': (adc.day[i] !== adc.day[i - 1]) ? '2px solid black' : (adc.day[i] === undefined) ? '0.1px solid thin black' : 'none',
    };
    return myStyles;
  }
}
