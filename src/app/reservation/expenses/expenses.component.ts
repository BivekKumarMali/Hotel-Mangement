import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Adc } from 'src/app/shared/models/adc';
import { Customer } from 'src/app/shared/models/customer';
import { Reservation } from 'src/app/shared/models/reservation';
import { Rooms } from 'src/app/shared/models/rooms';
import { Roomtype } from 'src/app/shared/models/roomtype';
import { CustomerService } from 'src/app/shared/service/customer.service';
import { ReservationService } from 'src/app/shared/service/reservation.service';
import { RoomService } from 'src/app/shared/service/room.service';
import { RoomtypeService } from 'src/app/shared/service/roomtype.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {

  pagetitle: string;
  errorMessage: string;
  roomtypes: Roomtype[];
  AddCustomer: string;
  rooms: Rooms[];
  overlay: string;
  Details: string[];
  totalCosts: number[];
  totalExpenses: number;
  paymentLeft: number;
  customer = this.customerservice.intailizecustomer();
  customers: Customer[];
  reservation = this.reservationservice.intailizeReservation();
  due: number;
  totalDeposited: number;
  constructor(
    private roomtypeservice: RoomtypeService,
    private roomsservice: RoomService,
    private reservationservice: ReservationService,
    private customerservice: CustomerService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('bid');
    this.reservationservice.getReservationById(id).subscribe({
      next: reservation => {
        this.reservation = reservation;
      },
      error: err => this.errorMessage = err,
      complete: () => this.FetchRoomList()
    });
  }

  FetchRoomList() {
    this.roomtypeservice.getAllRoomstype().subscribe({
      next: roomtype => {
        this.roomtypes = roomtype;
      },
      error: err => this.errorMessage = err,
      complete: () => this.FetchRoomNo()
    });
  }
  FetchRoomNo() {
    this.roomsservice.getAllRooms().subscribe({
      next: room => {
        this.rooms = room;
      },
      error: err => this.errorMessage = err,
      complete: () => this.FetchCustomer()
    });

  }
  FetchCustomer(): void {
    this.customerservice.getAllCustomer().subscribe({
      next: customer => {
        this.customers = customer;
      },
      error: err => this.errorMessage = err,
      complete: () => this.SetReseverstion()
    });
  }
  SetReseverstion() {
    this.reservation.customer = this.customers.find(x => x.cid === this.reservation.cid);
    const room = this.rooms.find(x => x.rid === this.reservation.rid);
    const roomtype = this.roomtypes.find(x => x.rtid === room.rtid);
    this.reservation.roomno = room.room_no;
    this.reservation.cost = roomtype.rent;
    this.reservation.type = roomtype.name;
    this.reservation.days = (new Date(this.reservation.checkout).getTime() - new Date(this.reservation.checkin).getTime()) / 86400000;
    this.totalExpenses = this.reservation.cost * this.reservation.days;
    this.SetOtherExpenses();
  }
  SetOtherExpenses() {
    const extracosts = this.reservation.extra.split(',');
    this.Details = new Array(extracosts.length);
    this.totalCosts = new Array(extracosts.length);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < extracosts.length; i++) {
      const expense = extracosts[i].split(' ');
      if (expense[0] === '') {
        continue;
      }

      this.totalCosts[i] = Number(expense[1]);
      this.Details[i] = expense[0];
      this.totalExpenses += this.totalCosts[i];
    }
    this.due = this.totalExpenses - Number(this.reservation.deposit);
    this.totalDeposited = Number(this.reservation.deposit) + Number(this.reservation.deposit1);
    console.log(this.totalExpenses, extracosts);
  }

}
