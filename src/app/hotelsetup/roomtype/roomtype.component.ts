import { Component, OnInit } from '@angular/core';
import { Rooms } from 'src/app/shared/models/rooms';
import { Roomtype } from 'src/app/shared/models/roomtype';
import { RoomtypeService } from 'src/app/shared/service/roomtype.service';
import { RoomService } from 'src/app/shared/service/room.service';

@Component({
  selector: 'app-roomtype',
  templateUrl: './roomtype.component.html',
  styleUrls: ['./roomtype.component.css']
})
export class RoomtypeComponent implements OnInit {

  active: string;
  pagetitle = 'Add';
  roomtype = this.roomtypeservice.intailizeRoomType();
  roomtypes: Roomtype[];
  rooms: Rooms[];
  FilterRoomTypes: Roomtype[];
  errorMessage: any;
  constructor(
    private roomtypeservice: RoomtypeService,
    private roomservice: RoomService) { }

  ngOnInit(): void {
    this.FetchList();
    this.FetchRooms();
  }
  FetchRooms() {
    this.roomservice.getAllRooms().subscribe({
      next: rooms => this.rooms = rooms
    });
  }
  saveRoomtype() {
    this.roomtype.rent = this.roomtype.exrent + (this.roomtype.exrent * this.roomtype.tax) / 100;
    if (this.roomtype.rtid === 0) {
      this.roomtypeservice.createRoomType(this.roomtype).subscribe({
        next: () => this.ngOnInit(),
        complete: () => this.formdisplay()
      });
    } else {
      const past = this.roomtypes.find(x => x.rtid === this.roomtype.rtid);
      this.roomtypeservice.updateRoomType(this.roomtype, past).subscribe({
        next: () => this.ngOnInit(),
        complete: () => this.formdisplay()
      });
    }
  }
  formdisplay() {
    this.pagetitle = 'Add';
    this.active = this.active ? '' : 'activate';
  }
  FetchList() {
    this.roomtypeservice.getAllRoomstype().subscribe({
      next: roomtype => {
        this.roomtypes = roomtype;
        this.FilterRoomTypes = this.roomtypes;
      },
      error: err => this.errorMessage = err
    });
  }
  Edit(rn: Roomtype) {
    this.formdisplay();
    this.pagetitle = 'Edit';
    const na = rn.name;
    this.roomtype.name = na;
    let im = rn.rent;
    this.roomtype.rent = im;
    im = rn.rtid;
    this.roomtype.rtid = im;
    im = rn.nop;
    this.roomtype.nop = im;
    im = rn.tax;
    this.roomtype.tax = im;
    this.roomtype.exrent = ((rn.rent * 100) / (+im + +100));
  }
  DeleteRoomType(fid: number, Name: string): void {
    const rt = this.roomtypes.find(x => x.rtid === fid);
    if (!this.rooms.find(x => x.rtid === fid)) {
      if (confirm('Delete ' + Name + ' from the list?')) {
        this.roomtypeservice.deleteroomtype(fid, rt).subscribe({
          next: () => this.DeleteRoom(fid),
          complete: () => this.ngOnInit()
        });
      }
    }
    else {
      alert('Not possible unless you delete the room of ' + Name + 'type');
    }
    location.reload();
  }
  DeleteRoom(id: number) {
    this.pagetitle = '';
  }
  search(filterBy: string) {
    this.FilterRoomTypes = filterBy ? this.performFilter(filterBy) : this.roomtypes;
  }
  performFilter(filterBy: string): Roomtype[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.roomtypes.filter((roomtype: Roomtype) =>
      roomtype.name.toLocaleLowerCase().indexOf(filterBy) !== -1);

  }
  Reset() {
    this.roomtype = this.roomtypeservice.intailizeRoomType();
    this.formdisplay();
  }

}
