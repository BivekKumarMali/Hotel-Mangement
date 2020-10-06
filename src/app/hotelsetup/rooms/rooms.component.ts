import { Component, OnInit } from '@angular/core';
import { Rooms } from 'src/app/shared/models/rooms';
import { Roomtype } from 'src/app/shared/models/roomtype';
import { RoomService } from 'src/app/shared/service/room.service';
import { RoomtypeService } from 'src/app/shared/service/roomtype.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  pagetitle = 'Add';
  room: Rooms;
  rooms: Rooms[];
  FilterRoom: Rooms[];
  roomtype: Roomtype[];
  listFilter: string;
  errorMessage: string;
  active: string;
  Confirmation = 0;
  status: string[] = ['Active', 'Inactive'];
  constructor(
    private roomservice: RoomService,
    private roomtypeservice: RoomtypeService) { }

  ngOnInit() {
    this.room = this.roomservice.intailizeRoom();
    this.fetchRooms();
  }
  fetchRooms(): void {
    this.roomservice.getAllRooms().subscribe({
      next: room => {
        this.rooms = room;
        this.FilterRoom = room;
      },
      error: err => this.errorMessage = err,
      complete: () => this.fetchRoomtype()
    });
  }
  fetchRoomtype(): void {
    this.roomtypeservice.getAllRoomstype().subscribe({
      next: roomtype => {
        this.roomtype = roomtype;
      },
      error: err => this.errorMessage = err,
      complete: () => this.finder()
    });
  }
  finder(rtype?: Roomtype): void {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.rooms.length; i++) {
      rtype = this.roomtype.find(a => a.rtid === this.rooms[i].rtid);
      this.rooms[i].type = rtype.name;
    }
  }
  saveRoom(rtype?: Roomtype): void {
    rtype = this.roomtype.find(a => a.name === this.room.type);
    this.room.rtid = rtype.rtid;
    if (this.room.rid === 0) {
      this.roomservice.createRoom(this.room).subscribe({
        next: () => this.ngOnInit(),
        complete: () => this.formdisplay()
      });
    } else {
      this.roomservice.updateRoom(this.room, this.rooms.find(x => x.rid === this.room.rid)).subscribe({
        next: () => this.ngOnInit(),
        complete: () => this.formdisplay()
      });
    }
  }
  Edit(room: Rooms): void {
    this.formdisplay();
    this.Confirmation = room.room_no;
    const book = room.status;
    const id = room.rtid;
    const rid = room.rid;
    const rno = room.room_no;
    const type = room.type;
    this.room.type = type;
    this.room.status = book;
    this.room.rid = rid;
    this.room.room_no = rno;
    this.room.rtid = id;
    this.pagetitle = 'Edit';
  }
  DeleteRoomType(fid: number, Name: string): void {
    if (confirm('Delete ' + Name + ' from the list?')) {
      this.roomservice.deleteroom(fid, this.rooms.find(x => x.rid === fid));
      location.reload();
    }
  }
  formdisplay() {
    this.active = this.active ? '' : 'activate';
    this.pagetitle = 'Add';
  }
  search(filterBy: any) {
    if (typeof filterBy === 'string') {
      this.FilterRoom = filterBy ? this.performFilterByType(filterBy) : this.rooms;
    }
    else {
      this.FilterRoom = filterBy ? this.performFilterByNo(filterBy) : this.rooms;
    }
  }
  performFilterByType(filterBy: string): Rooms[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.rooms.filter((room: Rooms) =>
      room.type.toLocaleLowerCase().indexOf(filterBy) !== -1);

  }
  performFilterByNo(filterBy: number): Rooms[] {
    const ilterBy = filterBy.toLocaleString();
    return this.rooms.filter((room: Rooms) =>
      room.room_no.toLocaleString().indexOf(ilterBy) !== -1);
  }
  Reset() {
    this.room = this.roomservice.intailizeRoom();
    this.formdisplay();
  }

}
