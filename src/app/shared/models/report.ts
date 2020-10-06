export interface Report {
  Name?: string;
  CheckIn?: Date;
  CheckOut?: Date;
  RoomNo?: number;
  Roomtype?: string;
  NoOfDays?: number;
  TotalCost?: number;
  Deposit?: number;
  Due?: number;
  Mobile?: number;
  Email?: string;
  Car?: string;
}
export interface EmployeeReport {
  Name?: string;
  Email?: string;
  Date?: string;
  Time?: string;
  Status?: string;
}
