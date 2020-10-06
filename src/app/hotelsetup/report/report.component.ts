import { Component, OnInit } from '@angular/core';
import { AngularCsv } from 'angular7-csv/dist/Angular-csv';
import { Report, EmployeeReport } from '../../shared/models/report';
import { Reservation } from '../../shared/models/reservation';
import { ReservationService } from '../../shared/service/reservation.service';
import { RoomService } from '../../shared/service/room.service';
import { RoomtypeService } from '../../shared/service/roomtype.service';
import { CustomerService } from '../../shared/service/customer.service';
import { Rooms } from '../../shared/models/rooms';
import { Roomtype } from '../../shared/models/roomtype';
import { Customer } from '../../shared/models/customer';
import { EmployeeService } from 'src/app/shared/service/employee.service';
import { RecordService } from 'src/app/shared/service/record.service';
import { Employee } from 'src/app/shared/models/employee';
import { Record } from 'src/app/shared/models/record';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  Reservation: Reservation[];
  month: string;
  roomtype: string;
  roomtypes: Roomtype[];
  checkin: Date;
  checkout: Date;
  Reports: Report[];
  customers: Customer[];
  customer: string;
  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Customer Report : ' + new Date().toLocaleDateString(),
    useBom: true,
    noDownload: false,
    headers: ['Name', 'CheckIn', 'CheckOut', 'RoomNo', 'Roomtype', 'NoOfDays', 'TotalCost', 'Deposit', 'Due', 'Email', 'Mobile', 'Car']
  };
  csvOptions1 = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Employee Report : ' + new Date().toLocaleDateString(),
    useBom: true,
    noDownload: false,
    headers: ['Name', 'Email', 'Status', 'Date', 'Time']
  };
  errorMessage: any;
  mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  employee: Employee[];
  record: Record[];
  EmployeeR: EmployeeReport[];


  constructor(
    private reservationservice: ReservationService,
    private roomservice: RoomService,
    private roomtypeservice: RoomtypeService,
    private customerservice: CustomerService,
    private employeeservice: EmployeeService,
    private recordservice: RecordService) { }

  ngOnInit(): void {
    this.fetchReservation();
    this.month = this.mS[new Date().getMonth()];
    this.fetchEmployee();
  }
  fetchEmployee() {
    this.employeeservice.getAllEmployee().subscribe({
      next: employees => {
        this.employee = employees;
      },
      error: err => this.errorMessage = err,
      complete: () => this.fetchRecord()
    });
  }
  fetchRecord() {
    this.recordservice.getAllRecord().subscribe({
      next: reco => {
        this.record = reco;
      },
      error: err => this.errorMessage = err,
      complete: () => this.SetupEmployeeReport()
    });
  }
  fetchReservation(): void {
    this.reservationservice.getAllReservation().subscribe({
      next: reservation => {
        this.Reservation = reservation;
      },
      error: err => this.errorMessage = err,
      complete: () => this.fetchRooms()
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
        this.roomtypes = roomtype;
      },
      error: err => this.errorMessage = err,
      complete: () => this.fetchCustomer(rooms)
    });
  }
  fetchCustomer(rooms: Rooms[]): void {
    this.customerservice.getAllCustomer().subscribe({
      next: customer => {
        this.customers = customer;
      },
      error: err => this.errorMessage = err,
      complete: () => this.finder(rooms)
    });
  }
  finder(rooms: Rooms[]): void {
    for (const reservation of this.Reservation) {
      const rm = rooms.find(x => x.rid === reservation.rid);
      const rt = this.roomtypes.find(x => x.rtid === rm.rtid);
      const cus = this.customers.find(x => x.cid === reservation.cid);
      reservation.name = cus.fname + ' ' + cus.lname;
      reservation.customer = cus;
      reservation.roomno = rm.room_no;
      reservation.type = rt.name;
      reservation.days = (new Date(reservation.checkout).getTime() - new Date(reservation.checkin).getTime()) / 86400000;
      reservation.cost = rt.rent * reservation.days;
    }
  }
  SetUpReport() {
    let i = 0;
    this.Reports = [];
    for (const reservation of this.Reservation) {
      if (!this.checkin && !this.checkout && !this.roomtype) {
        this.SetReport(reservation, i);
        i += 1;
      }
      else if (this.checkin && !this.checkout) {
        if (this.getT(this.checkin) <= this.getT(reservation.checkin) ||
          this.getT(this.checkin) <= this.getT(reservation.checkout)) {
          if (this.roomtype) {
            if (this.roomtype === reservation.type) {
              this.SetReport(reservation, i);
              i += 1;
            }
          }
          else {
            this.SetReport(reservation, i);
            i += 1;
          }
        }
      }
      else if (!this.checkin && this.checkout) {
        if (this.getT(this.checkout) >= this.getT(reservation.checkin) ||
          this.getT(this.checkout) >= this.getT(reservation.checkout)) {
          if (this.roomtype === reservation.type) {
            this.SetReport(reservation, i);
            i += 1;
          }
          else {
            this.SetReport(reservation, i);
            i += 1;
          }
        }
      }
      else if (!this.checkin && !this.checkout && this.roomtype) {
        if (this.roomtype === reservation.type) {
          this.SetReport(reservation, i);
          i += 1;
        }
      }
      else {
        if (
          (this.getT(this.checkin) <= this.getT(reservation.checkin) && this.getT(reservation.checkin) <= this.getT(this.checkout)) ||
          (this.getT(this.checkin) <= this.getT(reservation.checkout) && this.getT(reservation.checkout) <= this.getT(this.checkout)) ||
          (this.getT(this.checkin) >= this.getT(reservation.checkin) && this.getT(reservation.checkout) >= this.getT(this.checkout))
        ) {
          if (this.roomtype === reservation.type) {
            this.SetReport(reservation, i);
            i += 1;
          }
          else {
            this.SetReport(reservation, i);
            i += 1;
          }

        }
      }
    }
    this.downloadCSV();
  }
  getT(date: Date): number {
    return new Date(date).getTime();

  }
  SetReport(reservation: Reservation, i: number, report?: Report) {
    report = {};
    report.Name = reservation.customer.fname + ' ' + reservation.customer.lname;
    report.CheckIn = reservation.checkin;
    report.CheckOut = reservation.checkout;
    report.RoomNo = reservation.roomno;
    report.Roomtype = reservation.type;
    report.NoOfDays = reservation.days;
    report.TotalCost = reservation.cost;
    report.Deposit = reservation.deposit;
    report.Due = reservation.due;
    report.Email = reservation.customer.email;
    report.Mobile = reservation.customer.mobile;
    report.Car = reservation.customer.car;
    this.Reports[i] = {};
    this.Reports[i] = report;
  }
  downloadCSV() {
    if (this.customer !== '') {
      let i = 0;
      while (i < this.Reports.length) {
        if (this.customer !== this.Reports[i].Name) {
          this.Reports.splice(i, 1);
          i -= 1;
        }
        i += 1;
      }
    }
    // tslint:disable-next-line:no-unused-expression
    new AngularCsv(this.Reports, 'My report', this.csvOptions);
  }
  SetupEmployeeReport(er?: EmployeeReport) {
    er = {};
    this.EmployeeR = [];
    let i = 0;
    for (const e of this.employee) {
      er.Name = e.name;
      er.Email = e.mail;
      er.Status = 'UnPaid';
      er.Date = '';
      er.Time = '';
      this.EmployeeR[i] = {};
      this.EmployeeR[i] = er;
      i += 1;
    }
  }
  SetEmployeeReport(re?: Report, em?: Employee) {
    re = {};
    let flag = 0;
    for (const r of this.record) {
      if (r.action === 'Paid') {
        const arr = r.date.split(' ');
        if (arr[1] === this.month) {
          flag = 1;
          em = JSON.parse(r.status);
          const se = this.EmployeeR.find(x => x.Email === em.mail);
          se.Date = r.date;
          se.Time = r.time;
          se.Status = 'Paid';
        }
      }
    }
    this.EmployeeR = flag === 1 ? this.EmployeeR : [];
    console.log(this.EmployeeR);
    if (this.EmployeeR.length < 1) {
      alert('No Data Found');
    }
    else {
      // tslint:disable-next-line:no-unused-expression
      new AngularCsv(this.EmployeeR, 'Employee report', this.csvOptions1);
      location.reload();
    }
  }

}
