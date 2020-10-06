import { Component, OnInit } from '@angular/core';
import { Record } from '../shared/models/record';
import { RecordService } from '../shared/service/record.service';
import { Roomtype } from '../shared/models/roomtype';
import { RoomtypeService } from '../shared/service/roomtype.service';
import { CustomerService } from '../shared/service/customer.service';
import { Customer } from '../shared/models/customer';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {

  records: Record[];
  FilterRecords: Record[];
  roomtypes: Roomtype[];
  customers: Customer[];
  Show = false;
  errorMessage: any;
  str: string;
  constructor(
    private Service: RecordService,
    private roomtypeservice: RoomtypeService,
    private customerservice: CustomerService
  ) { }

  ngOnInit(): void {
    this.Service.getAllRecord().subscribe({
      next: data => {
        this.records = data;
        this.FilterRecords = data;
      },
      complete: () => this.fetchRoomtype()
    });
  }
  fetchRoomtype(): void {
    this.roomtypeservice.getAllRoomstype().subscribe({
      next: roomtype => {
        this.roomtypes = roomtype;
      },
      error: err => this.errorMessage = err,
      complete: () => this.fetchCustomer()
    });
  }
  fetchCustomer(): void {
    this.customerservice.getAllCustomer().subscribe({
      next: customer => {
        this.customers = customer;
      },
      error: err => this.errorMessage = err,
      complete: () => this.SetRecord()
    });
  }
  SetRecord() {
    this.records.reverse();
    for (const record of this.records) {
      if (record.section === 'Room') {
        record.room = JSON.parse(record.status);
        record.room.type = this.roomtypes.find(x => x.rtid === record.room.rtid).name;
        if (record.action === 'Updated') {
          record.room2 = JSON.parse(record.status2);
          record.room2.type = this.roomtypes.find(x => x.rtid === record.room2.rtid).name;
        }
      }
      else if (record.section === 'Reservation') {
        record.reservation = JSON.parse(record.status);
        record.reservation.customer = this.customers.find(x => x.cid === record.reservation.cid);
        if (record.action === 'Updated') {
          record.reservation2 = JSON.parse(record.status2);
          record.reservation2.customer = this.customers.find(x => x.cid === record.reservation2.cid);
        }
      }
      else if (record.section === 'Employee') {
        record.employee = JSON.parse(record.status);
        record.employee2 = JSON.parse(record.status2);
      }
      else if (record.section === 'Customer') {
        record.customer = JSON.parse(record.status);
        record.customer2 = JSON.parse(record.status2);
      }
      else if (record.section === 'Roomtype') {
        record.roomtype = JSON.parse(record.status);
        record.roomtype2 = JSON.parse(record.status2);
      }
    }
  }
  search() { }

}
