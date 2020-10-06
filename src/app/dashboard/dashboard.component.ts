import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Roomtype } from '../shared/models/roomtype';
import { Rooms } from '../shared/models/rooms';
import { Customer } from '../shared/models/customer';
import { Reservation } from '../shared/models/reservation';
import { RoomtypeService } from '../shared/service/roomtype.service';
import { RoomService } from '../shared/service/room.service';
import { CustomerService } from '../shared/service/customer.service';
import { ReservationService } from '../shared/service/reservation.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  errorMessage: any;
  NoOfRoomType: any;

  constructor(
    private router: Router,
    private roomtypeservice: RoomtypeService,
    private roomservice: RoomService,
    private customerservice: CustomerService,
    private reservationservice: ReservationService) { }
  reservation: number;
  customer: number;
  roomtype: number;
  active = 0;
  inactive = 0;
  ngOnInit(): void {
    this.FetchRoomType();
    this.FetchCustomer();
    this.FetchReservation();
    this.FetchRoom();
  }
  // Routing Functions
  RouteToReservation() {
    this.router.navigate(['/reservations']);
  }
  RouteToCustomer() {
    this.router.navigate(['/customers']);
  }
  RouteToRoomType() {
    this.router.navigate(['/roomtypes']);
  }
  RouteToRooms() {
    this.router.navigate(['/rooms']);
  }
  // Fetch
  FetchRoomType(roomtype?: Roomtype[]) {
    this.roomtypeservice.getAllRoomstype().subscribe({
      next: rooms => {
        roomtype = rooms;
      },
      error: err => this.errorMessage = err,
      complete: () => this.roomtype = roomtype.length
    });
  }
  FetchRoom(rooms?: Rooms[]) {
    this.roomservice.getAllRooms().subscribe({
      next: room => {
        rooms = room;
      },
      error: err => this.errorMessage = err,
      complete: () => this.GetLength(rooms)
    });
  }
  FetchCustomer(customer?: Customer[]) {
    this.customerservice.getAllCustomer().subscribe({
      next: customers => {
        customer = customers;
      },
      error: err => this.errorMessage = err,
      complete: () => this.customer = customer.length
    });
  }
  FetchReservation(reservations?: Reservation[]) {
    this.reservationservice.getAllReservation().subscribe({
      next: reservation => {
        reservations = reservation;
      },
      error: err => this.errorMessage = err,
      complete: () => this.reservation = reservations.length
    });
  }
  // Get Length of rooms
  GetLength(rooms: Rooms[]) {
    for (const rm of rooms) {
      if (rm.status === 'Active') {
        this.active += 1;
      }
      else {
        this.inactive += 1;
      }
    }
  }
}
