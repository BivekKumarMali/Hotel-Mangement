import { Rooms } from './rooms';
import { Customer } from './customer';
import { Employee } from './employee';
import { Roomtype } from './roomtype';
import { Reservation } from './reservation';

export interface Record {
    rdid: number;
    name: string;
    section: string;
    date: string;
    time: string;
    action: string;
    status: string;
    status2: string;
    show?: boolean;
    room?: Rooms;
    room2?: Rooms;
    roomtype?: Roomtype;
    roomtype2?: Roomtype;
    customer?: Customer;
    customer2?: Customer;
    employee?: Employee;
    employee2?: Employee;
    reservation?: Reservation;
    reservation2?: Reservation;
}
