import { Customer } from './customer';

export interface Reservation {
  bid: number;
  rid: number;
  cid: number;
  checkin: Date;
  checkout: Date;
  deposit: number;
  deposit1: number;
  due: number;
  payment: string;
  payment1: string;
  status: string;
  comment: string;
  extra: string;

  customer?: Customer;
  Extra?: string[];
  name?: string;
  show?: boolean;
  roomno?: number;
  type?: string;
  cost?: number;
  days?: number;
}
