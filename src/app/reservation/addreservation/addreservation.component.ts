import { Component, OnInit } from '@angular/core';
import { Roomtype } from 'src/app/shared/models/roomtype';
import { ActivatedRoute, Router } from '@angular/router';
import { Adc } from 'src/app/shared/models/adc';
import { Reservation } from 'src/app/shared/models/reservation';
import { Rooms } from 'src/app/shared/models/rooms';
import { Customer } from 'src/app/shared/models/customer';
import { RoomtypeService } from 'src/app/shared/service/roomtype.service';
import { RoomService } from 'src/app/shared/service/room.service';
import { ReservationService } from 'src/app/shared/service/reservation.service';
import { CustomerService } from 'src/app/shared/service/customer.service';

@Component({
  selector: 'app-addreservation',
  templateUrl: './addreservation.component.html',
  styleUrls: ['./addreservation.component.css']
})
export class AddreservationComponent implements OnInit {

  pagetitle: string;
  errorMessage: string;
  active = 1;
  roomtypes: Roomtype[];
  AddCustomer: string;
  rooms: Rooms[];
  FilterRooms: Rooms[];
  overlay: string;
  customer = this.customerservice.intailizecustomer();
  customers: Customer[];
  FilterCustomers: Customer[];
  adc: Adc[] = [];
  past: Reservation;
  payment = ['Card', 'Cash', 'Other'];
  reservation = this.reservationservice.intailizeReservation();
  reservations: Reservation[];
  flag: boolean;
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
      complete: () => this.FetchReservations()
    });
  }
  FetchReservations() {
    this.reservationservice.getAllReservation().subscribe({
      next: reservation => { this.reservations = reservation; },
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
        this.FilterCustomers = customer;
      },
      error: err => this.errorMessage = err,
      complete: () => this.SetRoomType()
    });
  }
  SetRoomType(): void {
    for (const rm of this.rooms) {
      const rtype = this.roomtypes.find(a => a.rtid === rm.rtid);
      rm.type = rtype.name;
    }
    this.FilterRooms = this.FilterByActive();
    this.SetupEdit();
  }
  FilterByActive() {
    return this.rooms.filter((room: Rooms) =>
      room.status.indexOf('Active') !== -1);
  }
  SetupEdit(): void {
    if (this.reservation.bid === 0) {
      this.pagetitle = 'Add';
    }
    else {
      this.customer = this.customers.find(x => x.cid === this.reservation.cid);
      const rm = this.rooms.find(x => x.rid === this.reservation.rid);
      this.reservation.roomno = rm.room_no;
      this.reservation.type = rm.type;
      this.reservation.cost = this.roomtypes.find(x => x.rtid === rm.rtid).rent;
      const r = ((new Date(this.reservation.checkout).getTime() - new Date(this.reservation.checkin).getTime()) / 86400000);
      this.reservation.cost = this.reservation.cost * r;
      this.pagetitle = 'Edit';
      this.active = 5;
      const index = this.reservations.findIndex(x => x.rid === this.reservation.rid);
      this.reservations.splice(index, 1);
      this.OnChange('');
    }
  }
  OnChange(filterBy: any) {
    this.FilterRooms = this.rooms;
    if (filterBy) {
      const rt = this.roomtypes.find(x => x.name === filterBy).rent;
      const r = ((new Date(this.reservation.checkout).getTime() - new Date(this.reservation.checkin).getTime()) / 86400000);
      this.reservation.cost = rt * r;
      this.reservation.due = this.reservation.cost - this.reservation.deposit - this.reservation.deposit1;
    }
    if (this.reservation.checkin && this.reservation.checkout) {
      this.removeRoom(new Date(this.reservation.checkout).getTime(), new Date(this.reservation.checkin).getTime());
      this.FilterRooms = filterBy ? this.performFilterByType(filterBy) : this.rooms;
    }
  }
  performFilterByType(filterBy: string): Rooms[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.FilterRooms.filter((room: Rooms) =>
      room.type.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }
  CalculateDiscount() {
    this.reservation.due = this.reservation.cost - this.reservation.deposit - this.reservation.deposit1;
  }
  nextStep() {
    this.active = this.active + 1;
  }
  perviousStep() {
    this.active = this.active - 1;
  }
  SetReservation() {
    if (this.customer.cid === 0) {
      this.customerservice.createCustomer(this.customer).subscribe({
        complete: () => this.customerservice.getAllCustomer().subscribe({
          next: customer => {
            this.customers = customer;
            this.flag = true;
          },
          error: err => this.errorMessage = err,
          complete: () => this.SaveReservatiions()
        })
      });
    }
    else {
      this.SaveReservatiions();
    }
  }
  SaveReservatiions() {
    this.reservation.rid = this.rooms.find(x => x.room_no === this.reservation.roomno).rid;
    let c = this.customer;
    if (this.flag) {
      c = this.customers.pop();
    }
    else {
      c = this.customer;
    }
    this.reservation.cid = c.cid;
    if (this.reservation.bid === 0) {
      this.reservationservice.createReservation(this.reservation).subscribe({
        complete: () => this.SaveComplete()
      });
    } else {
      const id = +this.route.snapshot.paramMap.get('bid');
      this.reservationservice.getReservationById(id).subscribe({
        next: reservation => {
          this.past = reservation;
        },
        error: err => this.errorMessage = err,
        complete: () => {
          this.reservationservice.updateReservation(this.reservation, this.past).subscribe({
            complete: () => this.SaveComplete()
          });
        }
      });
    }
  }
  SaveComplete() {
    this.router.navigate(['/reservations']);
  }
  formdisplay() {
    this.overlay = this.overlay ? '' : 'activate';
  }
  search(filterBy: any) {
    if (Number(filterBy)) {
      this.FilterCustomers = filterBy ? this.performFilterByMobile(filterBy) : this.customers;
    }
    else {
      this.FilterCustomers = filterBy ? this.performFilterByName(filterBy) : this.customers;
      if (!this.FilterCustomers) {
        this.FilterCustomers = filterBy ? this.performFilterByLastName(filterBy) : this.customers;
      }
    }
  }
  performFilterByMobile(filterBy: number): Customer[] {
    const filterB = filterBy.toLocaleString();
    return this.customers.filter((customer: Customer) =>
      customer.mobile.toLocaleString().indexOf(filterB) !== -1);
  }
  performFilterByName(filterBy: string): Customer[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.customers.filter((customer: Customer) =>
      customer.fname.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }
  performFilterByLastName(filterBy: string): Customer[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.customers.filter((customer: Customer) =>
      customer.lname.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }
  SetCustomer(c: Customer) {
    this.customer = c;
    this.formdisplay();
  }
  resetCustomer() {
    this.customer = this.customerservice.intailizecustomer();
  }
  removeRoom(cout: number, cin: number) {
    for (const reserve of this.reservations) {
      const co = new Date(reserve.checkout).getTime();
      const ci = new Date(reserve.checkin).getTime();
      if ((cout === co) || (cin === ci) || (cin < ci && ci < cout) || (cin < co && co < cout)) {
        let rm = this.rooms.findIndex(x => x.rid === reserve.rid);
        this.rooms.splice(rm, 1);
        rm = this.reservations.findIndex(x => x === reserve);
        this.reservations.splice(rm, 1);

      }
    }
  }
  Reset() {
    this.active = 1;
    this.reservationservice.getAllReservation().subscribe({
      next: reservation => { this.reservations = reservation; }
    });
    this.roomsservice.getAllRooms().subscribe({
      next: room => {
        this.rooms = room;
      },
      error: err => this.errorMessage = err,
      complete: () => {
        for (const rm of this.rooms) {
          const rtype = this.roomtypes.find(a => a.rtid === rm.rtid);
          rm.type = rtype.name;
        }
        this.FilterRooms = this.FilterByActive();
      }
    });
  }
}

